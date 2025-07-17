provider "aws" {
  region = "us-east-1"
}

# -----------------------------------------------------------------------------
# SECTION 1: VPC
# -----------------------------------------------------------------------------
resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"
  enable_dns_support    = true
  enable_dns_hostnames = true

  tags = {
    Name = "main-vpc"
  }
}

# -----------------------------------------------------------------------------
# SECTION 2: VPC SUBNETS: 1 Public and 2 Private
# -----------------------------------------------------------------------------
resource "aws_subnet" "public" {
  vpc_id                = aws_vpc.main.id
  cidr_block            = "10.0.1.0/24"
  availability_zone     = "us-east-1a"
  map_public_ip_on_launch = true

  tags = {
    Name = "public-subnet-01"
  }
}

resource "aws_subnet" "private_1" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.2.0/24"
  availability_zone = "us-east-1b"

  tags = {
    Name = "private-subnet-01-nat"
  }
}

resource "aws_subnet" "private_2" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.3.0/24"
  availability_zone = "us-east-1c"

  tags = {
    Name = "private-subnet-02-isolated"
  }
}

# -----------------------------------------------------------------------------
# SECTION 3: PUBLIC SUBNET
# -----------------------------------------------------------------------------
# Internet Gateway (IGW): Allows communication between the VPC and the internet.
resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "main-igw"
  }
}

# Elastic IP (EIP): A static public IP address for the NAT Gateway.
resource "aws_eip" "nat_eip" {
  domain = "vpc"
  depends_on = [aws_internet_gateway.igw]

  tags = {
    Name = "nat-gateway-eip"
  }
}

# NAT Gateway: Allows instances in private subnets to initiate outbound
# traffic to the internet.
resource "aws_nat_gateway" "nat" {
  allocation_id = aws_eip.nat_eip.id
  subnet_id     = aws_subnet.public.id

  tags = {
    Name = "main-nat-gateway"
  }
}

# Public Route Table: Directs internet-bound traffic from the public subnet
# to the Internet Gateway.
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0" # Represents all IP addresses (the internet)
    gateway_id = aws_internet_gateway.igw.id
  }

  tags = {
    Name = "public-route-table"
  }
}

# Route Table Association: Links the public route table to the public subnet.
resource "aws_route_table_association" "public" {
  subnet_id      = aws_subnet.public.id
  route_table_id = aws_route_table.public.id
}

# Network ACL (NACL): A stateless firewall for controlling traffic in and
# out of the public subnet. This is a basic "allow all" rule.
resource "aws_network_acl" "public" {
  vpc_id      = aws_vpc.main.id
  subnet_ids = [aws_subnet.public.id]

  # Allow all inbound traffic.
  ingress {
    protocol   = "-1" # -1 means all protocols
    rule_no    = 100
    action     = "allow"
    cidr_block = "0.0.0.0/0"
    from_port  = 0
    to_port    = 0
  }

  # Allow all outbound traffic.
  egress {
    protocol   = "-1"
    rule_no    = 100
    action     = "allow"
    cidr_block = "0.0.0.0/0"
    from_port  = 0
    to_port    = 0
  }

  tags = {
    Name = "public-nacl"
  }
}

# -----------------------------------------------------------------------------
# SECTION 4: PRIVATE SUBNET 1 - NAT ACCESS
# -----------------------------------------------------------------------------
# Private Route Table 1: Directs internet-bound traffic to the NAT Gateway.
resource "aws_route_table" "private_1" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.nat.id
  }

  tags = {
    Name = "private-route-table-nat"
  }
}

# Route Table Association: Links the private route table to the first private subnet.
resource "aws_route_table_association" "private_1" {
  subnet_id      = aws_subnet.private_1.id
  route_table_id = aws_route_table.private_1.id
}

# -----------------------------------------------------------------------------
# SECTION 5: PRIVATE SUBNET 2 - ISOLATED
# -----------------------------------------------------------------------------
# Private Route Table 2: This table only has the default local route,
# allowing communication within the VPC but not to the internet.
resource "aws_route_table" "private_2" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "private-route-table-isolated"
  }
}

# Route Table Association: Links the isolated route table to the second private subnet.
resource "aws_route_table_association" "private_2" {
  subnet_id      = aws_subnet.private_2.id
  route_table_id = aws_route_table.private_2.id
}

# -----------------------------------------------------------------------------
# SECTION 6: VPC PEERING (NOT REQUIRED)
# -----------------------------------------------------------------------------
# The two private subnets (10.0.2.0/24 and 10.0.3.0/24) can reach each
# other because of the default local route in their respective route tables.
# -----------------------------------------------------------------------------

# -----------------------------------------------------------------------------
# SECTION 7: IAM ROLES
# -----------------------------------------------------------------------------
# IAM Role for EC2 instance to allow Secure Session Manager (SSM) access
resource "aws_iam_role" "ec2_ssm_role" {
  name = "ec2-ssm-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      },
    ]
  })

  tags = {
    Name = "ec2-ssm-role"
  }
}

# Attach AmazonSSMManagedInstanceCore policy to the role
resource "aws_iam_role_policy_attachment" "ssm_policy_attachment" {
  role       = aws_iam_role.ec2_ssm_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

# IAM Instance Profile to attach the role to the EC2 instance
resource "aws_iam_instance_profile" "ec2_ssm_profile" {
  name = "ec2-ssm-profile"
  role = aws_iam_role.ec2_ssm_role.name
}

# -----------------------------------------------------------------------------
# SECTION 8: INSTANCE GROUP WITH AUTO-SCALING WITH ALB
# -----------------------------------------------------------------------------
resource "aws_security_group" "web_sg" {
  name        = "web-instance-sg"
  description = "Allow HTTP from ALB and SSH to web instances"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    security_groups = [aws_security_group.alb_sg.id] # Allow traffic from ALB's security group
    description = "Allow HTTP from ALB"
  }

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/32"] # Blocked Access: Change to your public IP if SSH is desired
    description = "Allow SSH"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1" # All protocols
    cidr_blocks = ["0.0.0.0/0"]
    description = "Allow all outbound traffic"
  }

  tags = {
    Name = "web-instance-sg"
  }
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

resource "aws_launch_template" "web_lt" {
  name_prefix   = "web-server-lt-"
  image_id      = data.aws_ami.ubuntu_jammy.id
  instance_type = "t2.micro" # Free-tier eligible
  vpc_security_group_ids = [aws_security_group.web_sg.id]
  iam_instance_profile {
    name = aws_iam_instance_profile.ec2_ssm_profile.name
  }
  # key_name      = "your-key-pair-name" #

  # Install SSM Agent and Nginx
  user_data = base64encode(<<-EOF
    #!/bin/bash
    sudo apt update -y
    sudo snap install amazon-ssm-agent --classic
    sudo apt install nginx -y
    sudo systemctl start nginx
    sudo systemctl enable nginx
    sudo systemctl enable amazon-ssm-agent
    sudo systemctl start amazon-ssm-agent
    echo "<h1>Hello World!</h1>" | sudo tee /var/www/html/index.html
  EOF
  )

  tag_specifications {
    resource_type = "instance"
    tags = {
      Name = "web-instance"
    }
  }
}

# Auto Scaling Group
resource "aws_autoscaling_group" "web_asg" {
  name                      = "web-asg"
  vpc_zone_identifier       = [aws_subnet.public.id]
  desired_capacity          = 1
  max_size                  = 3
  min_size                  = 1
  health_check_type         = "ELB"
  load_balancers            = [aws_lb.web_alb.name]
  target_group_arns         = [aws_lb_target_group.web_tg.arn]

  launch_template {
    id      = aws_launch_template.web_lt.id
    version = "$Latest"
  }

  tag {
    key                 = "Name"
    value               = "web-asg-instance"
    propagate_at_launch = true
  }
}

# Auto Scaling Policy (based on CPU utilization)
resource "aws_autoscaling_policy" "web_scaling_policy" {
  name                   = "web-cpu-scaling-policy"
  autoscaling_group_name = aws_autoscaling_group.web_asg.name
  policy_type            = "TargetTrackingScaling"
  target_tracking_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ASGAverageCPUUtilization"
    }
    target_value = 50.0 # Target CPU utilization at 50%
  }
}

# Security Group for Application Load Balancer (ALB)
resource "aws_security_group" "alb_sg" {
  name        = "alb-sg"
  description = "Allow HTTP inbound to ALB"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Allow HTTP from internet"
  }

  # Outbound access (ALB needs to reach instances)
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Allow all outbound traffic"
  }

  tags = {
    Name = "web-alb-sg"
  }
}

# Application Load Balancer (ALB)
resource "aws_lb" "web_alb" {
  name               = "web-application-lb"
  internal           = false # Publicly accessible
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb_sg.id]
  subnets            = [aws_subnet.public.id]

  enable_deletion_protection = false

  tags = {
    Name = "web-alb"
  }
}

# ALB Target Group
resource "aws_lb_target_group" "web_tg" {
  name     = "web-target-group"
  port     = 80
  protocol = "HTTP"
  vpc_id   = aws_vpc.main.id
  health_check {
    path                = "/"
    protocol            = "HTTP"
    matcher             = "200"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 2
  }

  tags = {
    Name = "web-target-group"
  }
}

# ALB Listener
resource "aws_lb_listener" "web_listener" {
  load_balancer_arn = aws_lb.web_alb.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    target_group_arn = aws_lb_target_group.web_tg.arn
    type             = "forward"
  }

  tags = {
    Name = "web-alb-listener"
  }
}

# -----------------------------------------------------------------------------
# SECTION 9: POSTGRESQL RDS INSTANCE - PRIVATE SUBNET
# -----------------------------------------------------------------------------
variable "db_username" {
  description = "Master username for the RDS PostgreSQL instance."
  type        = string
  sensitive   = true
}

variable "db_password" {
  description = "Master password for the RDS PostgreSQL instance."
  type        = string
  sensitive   = true
}

# Security Group for RDS PostgreSQL instance
resource "aws_security_group" "rds_sg" {
  name        = "rds-postgresql-sg"
  description = "Allow PostgreSQL traffic from bastion host"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    security_groups = [aws_security_group.bastion_sg.id] # Allow traffic from bastion host SG
    description = "Allow PostgreSQL from bastion host"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Allow all outbound traffic"
  }

  tags = {
    Name = "rds-postgresql-sg"
  }
}

# RDS Subnet Group
# Required for deploying RDS instances into a VPC, spanning multiple AZs
resource "aws_db_subnet_group" "rds_subnet_group" {
  name       = "main-rds-subnet-group"
  subnet_ids = [aws_subnet.private_2.id]
  description = "Subnet group for RDS PostgreSQL"

  tags = {
    Name = "main-rds-subnet-group"
  }
}

# PostgreSQL RDS Instance
resource "aws_db_instance" "postgresql_db" {
  allocated_storage    = 20                                  # Minimum 20 GB for free tier
  storage_type         = "gp2"
  engine               = "postgres"
  engine_version       = "14.10"                             # Check latest free-tier compatible version
  instance_class       = "db.t3.micro"                       # Free-tier eligible
  identifier           = "my-postgresql-db"
  username             = var.db_username
  password             = var.db_password
  db_subnet_group_name = aws_db_subnet_group.rds_subnet_group.name
  vpc_security_group_ids = [aws_security_group.rds_sg.id]
  skip_final_snapshot  = true                                # Set to false in production
  publicly_accessible  = false                               # private subnet
  multi_az             = false                               # Set to true for high availability
  storage_encrypted    = true
  # backup_retention_period = 7
  # final_snapshot_identifier = "my-postgresql-final-snapshot"

  tags = {
    Name = "my-postgresql-db"
  }
}

# -----------------------------------------------------------------------------
# Section 10: BASTION HOST - FOR ACCESSING RDS
# -----------------------------------------------------------------------------
# Security Group for the Bastion Host
resource "aws_security_group" "bastion_sg" {
  name        = "bastion-host-sg"
  description = "Allow SSH to bastion and outbound PostgreSQL to RDS"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/32"] # Blocked Access: Replace with your actual public IP
    description = "Allow SSH from your IP"
  }

  egress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = [aws_subnet.private_1.cidr_block, aws_subnet.private_2.cidr_block]
    description = "Allow outbound PostgreSQL to RDS subnets"
  }

  # SSM agent (HTTPS to AWS endpoints)
  egress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # Or more restrictive VPC endpoints for SSM
    description = "Allow outbound HTTPS for SSM"
  }

  tags = {
    Name = "bastion-host-sg"
  }
}

# EC2 Bastion Host in private_1 subnet
resource "aws_instance" "bastion_host" {
  ami                         = data.aws_ami.ubuntu_jammy.id
  instance_type               = "t2.micro"
  subnet_id                   = aws_subnet.private_1.id
  associate_public_ip_address = false # No public IP, access via Session Manager
  vpc_security_group_ids      = [aws_security_group.bastion_sg.id]
  iam_instance_profile        = aws_iam_instance_profile.ec2_ssm_profile.name
  # key_name                    = "your-key-pair-name"

  # Install SSM agent
  user_data = base64encode(<<-EOF
    #!/bin/bash
    sudo snap install amazon-ssm-agent --classic
    sudo systemctl enable amazon-ssm-agent
    sudo systemctl start amazon-ssm-agent
  EOF
  )

  tags = {
    Name = "bastion-host"
  }
}

# -----------------------------------------------------------------------------
# SECTION 11: IMPORTANT OUTPUTS
# -----------------------------------------------------------------------------
output "alb_dns_name" {
  description = "The DNS name of the Application Load Balancer."
  value       = aws_lb.web_alb.dns_name
}

output "rds_endpoint" {
  description = "The endpoint of the RDS PostgreSQL instance."
  value       = aws_db_instance.postgresql_db.address
}

output "rds_port" {
  description = "The port of the RDS PostgreSQL instance."
  value       = aws_db_instance.postgresql_db.port
}

output "bastion_instance_id" {
  description = "The ID of the EC2 Bastion Host instance."
  value       = aws_instance.bastion_host.id
}
