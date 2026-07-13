FROM node:20-alpine

WORKDIR /app

COPY package.json ./
RUN npm install --omit=dev --ignore-scripts

COPY server.mjs ./

RUN mkdir -p /data && chown -R node:node /app /data
USER node

EXPOSE 8787
VOLUME ["/data"]

CMD ["node", "server.mjs"]
