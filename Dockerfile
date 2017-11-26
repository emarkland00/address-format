FROM node

# create workspace
RUN mkdir /app
WORKDIR /app

# setup workspace
COPY src/package.json /app
RUN npm install
COPY ./src /app

# fire it up
CMD npm start
EXPOSE 3000
