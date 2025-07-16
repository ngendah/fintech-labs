# 💸 Savings API

A minimal Node.js microservice that simulates automated recurring savings logic, ideal for fintech workflows.

## Features

  * Create savings schedules via API.
  * Simulate recurring deposits using `node-cron`.
  * Local or Kubernetes Deployment

----

## Setup

### Local Deployment

1.  **Install Docker:** Ensure you have [Docker](https://docs.docker.com/) installed.

2.  **Build and Run (Default SQLite):**
    Build the Docker image and run the service using an in-memory SQLite database.

    ```bash
    docker build -t fintech-labs-savings-automaton .
    docker run -p 3000:3000 -it fintech-labs-savings-automaton
    ```

3.  **Run with PostgreSQL:**
    To use PostgreSQL, pass the `DATABASE_URL` as an environment variable.

    ```bash
    docker run -e DATABASE_URL="postgres://user:pass@localhost:5432/mydb" -p 3000:3000 -it fintech-labs-savings-automaton
    ```

-----

### Kubernetes Deployment

For Kubernetes deployment, your cluster should be configured to pull images from your Docker registry.

1.  **Build and Push Docker Image:**
    Build your Docker image and push it to your configured container registry.

    ```bash
    docker build -t savings-automaton:latest .
    docker tag savings-automaton:latest savings-automaton:latest
    docker push savings-automaton:latest
    ```

2.  **Deploy to Kubernetes:**
    Apply the manifest file to your Kubernetes cluster.

    ```bash
    kubectl apply -f savings-automaton.yaml
    ```

### Accessing the API

* **Docker:** The API will be available at `http://localhost:3000`.
* **Kubernetes (Cluster Internal):** Other services within your cluster can access the API at `http://savings-automaton-service:80`. For external access, change the `Service` type to `NodePort` or `LoadBalancer`, or set up an Ingress.

-----