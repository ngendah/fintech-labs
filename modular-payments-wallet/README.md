# Moduler Payments Wallet Micro-Services

A NodeJS(NestJS) Micro-Services that simulates real micro-service arch-type. The focus of this project is to show the structure and interaction of the various
micro-service.

## Features

* API service that serves as the external interface to users and user clients
* Micro-Services:
  - Fraud Detection Micro service. This is triggered whenever a customer executes a transaction.
  - KYC(know-your-customer) micro-service. This is triggered when a customer submits required documents.
  - notification micro-service. This is triggered to when a user or some other api call requires to notify a customer of important details
* Docker and Kubernetes Deployment

----

## Setup

### Local Deployment

1. **Install Docker:** Ensure you have [Docker](https://docs.docker.com/) installed.

2. **Build and Run:**
    Build the Docker image and run the service.

    ```bash
    docker compose up --build
    ```

-----
### Accessing the API

1. To simulate api calls that trigger the fraud-detection micro-service send the request:
```api

curl -X POST -H 'Content-Type: application/json' -d '{amount: 1000, mobileNumber: "0700900800"}' http://localhost:300/transaction
```

2. To simulate api calls that trigger kyc(know-your-customer) micro-service send the request:
```api

curl -X POST -H 'Content-Type: application/json' -d '{}' http://localhost:300/user
```

3. To simulate api calls that trigger notification micro-service send the request:
```api

curl -X POST -H 'Content-Type: application/json' -d '{}' http://localhost:300/wallet/balance
```


-----


