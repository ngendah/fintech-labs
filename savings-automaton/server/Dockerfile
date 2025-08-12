FROM node:24-slim
RUN apt-get update -y && apt-get install -y openssl && npm i -g @nestjs/cli
RUN useradd -MUu 1001 fintech-labs
USER fintech-labs
WORKDIR /home/fintech-labs/savings-automaton
ENV HOME=/home/fintech-labs
COPY --chown=fintech-labs:fintech-labs package.json package-lock.json .
RUN npm i --omit=dev
COPY --chown=fintech-labs:fintech-labs . .
EXPOSE 3000
CMD ["sh", "start.sh"]
