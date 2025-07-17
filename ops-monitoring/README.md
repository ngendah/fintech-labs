# Monitoring & Alerts for Cloud Apps

Deploy a monitoring stack (Prometheus, Grafana, Loki) and a sample application with simulated logs.

---

## Features

* **Monitoring Stack**: Prometheus, Grafana, and Loki.
* **Sample Application**: Application that generates logs.
* **Secure Networking**: VPC and AWS Security Groups.

---

## Setup

1.  **AWS Credentials:** Configure AWS CLI for `us-east-1`.

2.  **Terraform:** Ensure Terraform is installed.

3.  **Clone Repo:** `git clone <your-repository-url>`

4.  **Deploy:**

    ```
    terraform init
    terraform plan
    terraform apply

    ```

## Tear down

To tear down all the resources provisioned by this Terraform project, run the following command:

```bash
terraform destroy
```
