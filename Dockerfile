FROM node:12-alpine

# Install some dev tools
RUN npm install -g nodemon

# Set up work directory
RUN mkdir -p /usr/app/src
COPY . /usr/app
WORKDIR /usr/app/

# Set up node environment
ENV NODE_ENV=production

EXPOSE 3000

RUN npm install

# Set up run command
CMD ["npm", "start"]