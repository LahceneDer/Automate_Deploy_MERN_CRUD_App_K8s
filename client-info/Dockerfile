# Use an official Node.js runtime as the base image
FROM node:14 as build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package.json package-lock.json ./

# Install dependencies
RUN npm i

# Copy the app's source code to the working directory
COPY . .

# Build the React app
RUN npm run build

# Use a lightweight Node.js image as the base image for the production build
FROM node:14-alpine

# Set the working directory
WORKDIR /app

# Copy the built React app from the build stage to the current working directory
COPY --from=build /app/build /app

# Expose the React app on port 5555
EXPOSE 5555

# Start the React app
CMD ["npx", "serve", "-s", "-l", "5555", "."]

