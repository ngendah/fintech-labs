from node:24-slim as base
RUN apt-get update -y && apt-get install -y curl openssl tini
RUN useradd -MUu 1001 fintech-labs
USER fintech-labs
WORKDIR /home/fintech-labs/eticketing
ENV HOME=/home/fintech-labs/eticketing
COPY --chown=fintech-labs:fintech-labs package.json package-lock.json .
RUN npm i
EXPOSE 3000 4000
COPY --chown=fintech-labs:fintech-labs . .
