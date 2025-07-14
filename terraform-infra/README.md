# 🌐 Infrastructure as Code (IaC) for Fintech App

This Terraform project provisions a secure and scalable AWS infrastructure for a fintech application.

## Features

* **Modular VPC:** Public and private subnets.

* **Internet Access:** IGW for public, NAT Gateway for private outbound.

* **Scalable Web Tier:** ALB with Auto Scaling Group for Ubuntu web servers.

* **Secure Database:** Private PostgreSQL RDS instance.

* **Secure DB Access:** EC2 bastion host via AWS EC2 Connect (Session Manager).

* **Security Groups:** Granular traffic control.

* **Secrets Management:** Sensitive variables for database credentials.

## Setup

1.  **AWS Credentials:** Configure AWS CLI for `us-east-1`.

2.  **Terraform:** Ensure Terraform is installed.

3.  **Clone Repo:** `git clone <your-repository-url>`

4.  **Sensitive Variables:** Create `terraform.tfvars` (add to `.gitignore`):

    ```
    db_username = "your_db_username"
    db_password = "your_strong_db_password"

    ```

5.  **Update Placeholders:**

    * `aws_launch_template.web_lt` (`key_name`): Replace `"your-key-pair-name"` if using SSH.

    * `aws_security_group.bastion_sg` (`ingress` rule `cidr_blocks`): Replace `"YOUR_PUBLIC_IP_CIDR"` with your public IP for SSH access.

6.  **Deploy:**

    ```
    terraform init
    terraform plan
    terraform apply

    ```

### Connecting to RDS via Bastion Host (EC2 Connect)

1.  **Access Bastion:** EC2 Console -> `bastion-host` -> Connect -> Session Manager.

2.  **Install PostgreSQL Client:**

    ```
    sudo apt update
    sudo apt install postgresql-client -y

    ```

3.  **Connect:**

    ```
    psql -h <RDS_ENDPOINT_FROM_OUTPUTS> -p 5432 -U <YOUR_DB_USERNAME> -d postgres

    ```

## Tear down

To tear down all the resources provisioned by this Terraform project, run the following command:

```bash
terraform destroy
```

## Shared Infrastructure

For shared infrastructure code in a team environment, it is crucial to store this state remotely and securely.

Use the following code to enable state management using S3 bucket and DynamoDB.

**Configuration in `terraform.tf`:**

```terraform
terraform {
  backend "s3" {
    bucket         = "your-terraform-state-bucket" # REPLACE with your unique S3 bucket name
    key            = "fintech-app/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "your-terraform-lock-table"   # REPLACE with your DynamoDB table name
  }
}

