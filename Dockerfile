FROM node:alpine

WORKDIR /usr/app/
COPY . .

RUN npm build
RUN NODE_ENV=production

RUN npm start
