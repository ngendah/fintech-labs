# 💸 Savings API

A minimal Node.js microservice that simulates an automated recurring savings logic—ideal for fintech workflows.

## Features

- Create a savings schedule via API
- Simulate recurring deposits using `node-cron`

## Setup
1. Install [Docker](https://docs.docker.com/)
2. Build and run
```bash
docker build -t fintech-labs-savings-automaton .
docker run -p 3000:3000 -it fintech-labs-savings-automaton
```
3. The default `DATABASE_URL` is an in-memory sqlite3 database. To use postgresql, pass a command argument 
```bash
docker run -e DATABASE_URL="postgres://user:pass@localhost:5432/mydb" -p 3000:3000 -it fintech-labs-savings-automaton
```