FROM node:20.13-buster-slim as base

# Ensure software is up to date
RUN apt-get update && apt-get install -y

# Set up node environment
ARG NODE_ENV
ENV NODE_ENV=${NODE_ENV}

ARG PORT=3000

# Set up work directory
RUN mkdir -p /usr/app/src
#RUN chown -R node:node /usr/app/*
#USER node
COPY . /usr/app
WORKDIR /usr/app/

# Install dependencies
RUN npm install

# Expose needed ports
EXPOSE ${PORT}



# BUILD TARGET: development
FROM base as development
CMD ["npm", "run", "dev"]

# BUILD TARGET: production
FROM base as production
CMD ["npm", "run", "start"]

FROM base as test
CMD ["npm", "run", "test"]