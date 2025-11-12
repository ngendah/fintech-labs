from node:24-slim as base
RUN apt-get update -y && apt-get install -y curl openssl tini && npm i -g @nestjs/cli
RUN useradd -MUu 1001 fintech-labs
USER fintech-labs
WORKDIR /home/fintech-labs/eticketing
ENV HOME=/home/fintech-labs/eticketing
COPY --chown=fintech-labs:fintech-labs package.json package-lock.json .
RUN npm i
COPY --chown=fintech-labs:fintech-labs . .
ENTRYPOINT ["tini", "--"]
