FROM node:9.2.0-alpine

RUN mkdir -p /usr/app
WORKDIR /usr/app

COPY src/package.json package.json
RUN npm install
ENV NODE_ENV=production

COPY src/* .
CMD ["npm", "start"]

EXPOSE 3000
