# Use an official Node.js image as the base
FROM node:14-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the dependencies
RUN npm install
RUN npm install @popperjs/core

# Copy the rest of the application code to the working directory
COPY . .

# Set the command to run the application
CMD ["node", "index.js"]

