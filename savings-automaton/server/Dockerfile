FROM node:24-slim
RUN addgroup --system fintech-labs \
    && adduser --system --ingroup fintech-labs fintech-labs
USER fintech-labs
WORKDIR /home/fintech-labs/savings-automaton
ENV HOME=/home/fintech-labs
COPY --chown=fintech-labs:fintech-labs . .
RUN npm install --omit=dev
EXPOSE 3000
ENTRYPOINT ["/bin/sh"]
CMD ["-c", "./start.sh"]
