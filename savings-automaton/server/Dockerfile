FROM node:24-slim
RUN addgroup --system -g 1001 fintech-labs \
    && adduser --system --ingroup -u 1001 fintech-labs fintech-labs
USER fintech-labs
WORKDIR /home/fintech-labs/savings-automaton
ENV HOME=/home/fintech-labs
COPY --chown=fintech-labs:fintech-labs package-lock.json .
RUN npm install --omit=dev
COPY --chown=fintech-labs:fintech-labs . .
EXPOSE 3000
CMD ["nest", "start"]
