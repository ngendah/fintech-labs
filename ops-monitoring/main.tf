provider "aws" {
  region = "us-east-1"
}

# -----------------------------------------------------------------------------
# SECTION 1: SET-UP SSH KEY
# -----------------------------------------------------------------------------
variable "key_name" {
  description = "Name of the SSH key pair to use for the instances."
  type        = string
  default     = "ops-monitoring"
}

resource "tls_private_key" "project_key" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

resource "aws_key_pair" "generated_key" {
  key_name   = var.key_name
  public_key = tls_private_key.project_key.public_key_openssh
}

resource "local_file" "private_key" {
  content  = tls_private_key.project_key.private_key_pem
  filename = "${path.module}/.tmp/${var.key_name}.pem"
  file_permission = "0400"
}

data "aws_ami" "ubuntu_jammy" {
  most_recent = true
  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }
  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
  owners = ["099720109477"] # Canonical's AWS account ID
}

resource "aws_security_group" "ops_monitoring" {
  name        = "project-showcase-sg"
  description = "Allow SSH, Web, and internal traffic"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/32"] # Block Access: Change to your public IP
  }

  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    from_port   = 9090
    to_port     = 9090
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    self        = true
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# -----------------------------------------------------------------------------
# SECTION 2: MONITORING INSTANCE WITH LGP (Loki-Grafana-Prometheus)
# -----------------------------------------------------------------------------
data "cloudinit_config" "monitoring_configuration" {
  gzip          = false
  base64_encode = false

  part {
    content_type = "text/x-shellscript"
    filename = "ssm_agent_install.sh"
    content = file("${path.module}/scripts/ssm_agent_install.sh")
  }

  part {
    content_type = "text/x-shellscript"
    filename = "docker_install.sh"
    content = file("${path.module}/scripts/docker_install.sh")
  }
}

resource "aws_instance" "monitoring" {
  ami           = data.aws_ami.ubuntu_jammy.id
  instance_type = "t2.micro"
  key_name                    = aws_key_pair.generated_key.key_name
  vpc_security_group_ids      = [aws_security_group.ops_monitoring.id]
  associate_public_ip_address = true

  provisioner "file" {
    source      = "${path.module}/config/prom_ds.yaml"
    destination = "/etc/grafana/data_sources/prom_ds.yaml"
  }

  provisioner "file" {
    source      = "${path.module}/compose/plg-stack-docker-compose.yaml"
    destination = "/usr/local/docker-compose.yaml"
  }

  user_data = data.cloudinit_config.monitoring_configuration.rendered

  provisioner "remote-exec" {
    inline = [
      "docker compose up -d --build -f /usr/local/docker-compose.yaml"
    ]
    connection {
      type     = "ssh"
      user     = "ubuntu"
      private_key = tls_private_key.project_key.private_key_pem
      host        = self.public_ip
    }
  }
}

# -----------------------------------------------------------------------------
# SECTION 2: APPLICATION INSTANCE WITH SIMULATION APP AND GRAFANA ALLOY
# -----------------------------------------------------------------------------
resource "local_file" "config_alloy" {
  content  = templatefile("${path.module}/config/config.alloy.tpl", {
    name = "monitoring_host",
    value = aws_instance.monitoring.public_ip
  })
  filename = "${path.module}/.tmp/config_alloy"
}

data "cloudinit_config" "app_sim_configuration" {
  gzip          = false
  base64_encode = false

  part {
    content_type = "text/x-shellscript"
    filename = "ssm_agent_install.sh"
    content = file("${path.module}/scripts/ssm_agent_install.sh")
  }

  part {
    content_type = "text/x-shellscript"
    filename = "python3_install.sh"
    content = file("${path.module}/scripts/python3_install.sh")
  }

  part {
    content_type = "text/x-shellscript"
    filename = "alloy_install.sh"
    content = file("${path.module}/scripts/alloy_install.sh")
  }
}

resource "aws_instance" "app_sim" {
  ami           = data.aws_ami.ubuntu_jammy.id
  instance_type = "t2.micro"
  key_name                    = aws_key_pair.generated_key.key_name
  vpc_security_group_ids      = [aws_security_group.ops_monitoring.id]
  associate_public_ip_address = true

  provisioner "file" {
    source      = "${path.module}/bin/simulation.py"
    destination = "/usr/local/bin/simulation.py"
  }

  provisioner "file" {
    source      = "${path.module}/.tmp/config_alloy"
    destination = "/etc/default/alloy"
  }

  user_data = data.cloudinit_config.app_sim_configuration.rendered

  provisioner "remote-exec" {
    inline = [
      "export LOKI_HOST=${aws_instance.monitoring.public_ip}",
      "python3 /usr/local/bin/simulation.py"
    ]
    connection {
      type     = "ssh"
      user     = "ubuntu"
      private_key = file("~/.ssh/${aws_instance.app_sim.host_id}.pem")
      host     = aws_instance.app_sim.public_ip
    }
  }
}

# -----------------------------------------------------------------------------
# SECTION 11: IMPORTANT OUTPUTS
# -----------------------------------------------------------------------------
output "monitoring_instance_public_ip" {
  value = aws_instance.monitoring.public_ip
}

output "app_sim_instance_public_ip" {
  value = aws_instance.app_sim.public_ip
}

output "ssh_command" {
  value = "ssh -i ${local_file.private_key.filename} ubuntu@<PUBLIC_IP>"
}