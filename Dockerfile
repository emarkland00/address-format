FROM node:12-alpine

# Set up work directory
RUN mkdir -p /usr/app/src
WORKDIR /usr/app/

# Set up node environment
COPY package.json package.json
RUN npm install
ENV NODE_ENV=production

# Copy babel settings
COPY .babelrc .babelrc

# Copy source
RUN mkdir -p /usr/app/src/
COPY src/ /usr/app/src/

# Set up run command
CMD ["npm", "start"]
EXPOSE 3000
