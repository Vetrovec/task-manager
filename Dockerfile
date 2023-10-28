FROM node:20-alpine

WORKDIR /app

COPY packages              ./packages
COPY package.json          .
COPY package-lock.json     .
COPY proxy.js              .
COPY docker-entrypoint.sh  .

RUN npm ci --no-audit
RUN npm run build:backend
RUN npm run build:frontend

EXPOSE 3000
ENTRYPOINT ["sh", "/app/docker-entrypoint.sh"]
