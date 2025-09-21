FROM node:24-slim
RUN apt-get update -y \
    && apt-get install -y openssl tini lsof \
    && npm i -g @nestjs/cli \
    && useradd -MUu 1001 fintech-labs
USER fintech-labs
WORKDIR /home/fintech-labs
ENV HOME=/home/fintech-labs
COPY --chown=fintech-labs:fintech-labs package.json package-lock.json .
RUN npm install
COPY --chown=fintech-labs:fintech-labs . .
ENTRYPOINT ["tini", "--"]
CMD ["nest", "start", "api"]
