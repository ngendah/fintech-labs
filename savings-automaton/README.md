# 💸 Savings API

A NodeJS(NestJS/Prisma) API that simulates automated recurring savings logic with Bank Integration(Equity Bank Kenya), ideal for fintech workflows.

## Features

* Create savings schedules via API.
* Bank integration and use of USSD triggers.
* Simulate recurring deposits.
* Local or Kubernetes Deployment

----

## Setup

### Local Deployment

1. **Install Docker:** Ensure you have [Docker](https://docs.docker.com/) installed.

2. **Build and Run:**
    Build the Docker image and run the service.

    ```bash
    cp server/config.example.yaml config.yaml
    docker compose up --build
    ```

-----

### Kubernetes Deployment

For Kubernetes deployment, your cluster should be configured to pull images from your Docker registry.

1. **Build and Push Docker Image:**
    Build your Docker image and push it to your configured container registry.

    ```bash
    cd server
    docker build -t savings-automaton:latest .
    docker tag savings-automaton:latest savings-automaton:latest
    docker push savings-automaton:latest
    ```

2. **Deploy to Kubernetes:**
    Apply the manifest file to your Kubernetes cluster.

    ```bash
    kubectl apply -f savings-automaton.yaml
    ```

### Accessing the API

* **Docker:** The API will be available at `http://localhost:3000`.
* **Kubernetes (Cluster Internal):** Other services within your cluster can access the API at `http://savings-automaton-service:80`. For external access, change the `Service` type to `NodePort` or `LoadBalancer`, or set up an Ingress.

-----
