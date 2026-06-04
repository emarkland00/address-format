FROM node:24-bullseye-slim AS source

WORKDIR /usr/app

COPY package*.json ./
RUN npm ci

COPY . .

FROM source AS builder

RUN npm run build

FROM node:24-bullseye-slim AS production

WORKDIR /usr/app

COPY --chown=node:node package*.json ./
RUN npm ci --omit=dev

COPY --from=builder --chown=node:node /usr/app/build ./build

USER node

EXPOSE 3000

CMD ["node", "build/app.js"]

FROM source AS development

ARG PORT=3000
ENV PORT=${PORT}

EXPOSE ${PORT}

CMD ["npm", "run", "dev"]
