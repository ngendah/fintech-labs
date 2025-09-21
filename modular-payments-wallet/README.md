# Moduler Payments Wallet Micro-Services

A NodeJS(NestJS) Micro-Services that simulates real micro-service arch-type. The focus of this project is to show the structure and interaction of the various
micro-service.

## Features

* API service that serves as the external interface to users and user clients
* Micro-Services:
  - Fraud Detection Micro service. This is triggered whenever a customer executes a transaction.
  - KYC(know-your-customer) micro-service. This is triggered when a customer submits required documents.
  - notification micro-service. This is triggered to when a user or some other api call requires to notify a customer of important details
* Docker Deployment

## Implementation

There are 2 Implementation:

1. Using tcp with optional TLS
2. Using Kafka

## Micro-service structure:
How services are partitioned is important as it impacts:

1. Development costs - Personnel and Time
2. Infrastructure costs 
3. Systems security

Theories how this can be achieved include:

1. [Domain Driven Design](https://learn.microsoft.com/en-us/azure/architecture/guide/architecture-styles/microservices)
2. [Conway's Laws](https://alibaba-cloud.medium.com/conways-law-a-theoretical-basis-for-the-microservice-architecture-c666f7fcc66a)
