FROM node:24-bookworm-slim
WORKDIR /app
COPY commercial /app/commercial
ENV NODE_ENV=production FR_ENV=production HOST=0.0.0.0 PORT=8787
USER node
EXPOSE 8787
CMD ["node","commercial/server.mjs"]
