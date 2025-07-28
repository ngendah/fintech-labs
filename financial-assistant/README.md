# 📊 Financial Assistant

A minimal financial data explorer that uses an LLM agent to retrieve and analyze financial performance data for **Safaricom Ltd** and **Equity Bank** from **2021 to 2024**.

## Features

  * **LLM Agent** using **LlamaIndex** with **Gemini** or **Ollama**
  * **Web UI** built with **Next.js** for intuitive query interaction
  * **Dockerized** setup using **Docker Compose** for easy deployment

----

## Setup

1. **Install Docker:** Ensure you have [Docker](https://docs.docker.com/) installed.

2. **Configure the environment**:
```bash
cp env.sample .env
```
  If you are using Gemini provide your **API_KEY** 

3.  **Build and Run**
```bash
docker-compose up --build
```

### Accessing the Web UI

The web UI will be available at `http://localhost:3000`.

> The assistant may need to download documents from the internet,
> which can introduce delays depending on connection speed.
-----


