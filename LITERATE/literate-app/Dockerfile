# Build from carbon version of node image
FROM node:carbon

# Create app directory to hold application code inside image
# This will be the working directory for the application
WORKDIR /usr/src/app

# Install nodemon for development builds
# RUN npm install -g nodemon

# Install app dependencies
# Copy both package.json and package-lock.json
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Our app binds to port 3000. Map this port to the docker daemon.
EXPOSE 3000

# Set environment variable for the Readability Server's hostname
ENV READABILITY_HOST=server

# Run our app
CMD [ "npm", "start" ]