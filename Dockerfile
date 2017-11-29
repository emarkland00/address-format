FROM node:9.2.0-alpine

RUN mkdir /app
WORKDIR /app
RUN npm install

COPY src/* .
CMD ["npm", "start"]
EXPOSE 3000
