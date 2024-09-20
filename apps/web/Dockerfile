# Stage 1: Build the React app
FROM node:18-alpine AS build

# Install pnpm globally
RUN npm install -g pnpm

# Set the working directory in the container
WORKDIR /app

# Copy package.json and pnpm-lock.yaml to install dependencies
COPY package.json pnpm-lock.yaml ./

# Install dependencies using pnpm
RUN pnpm install --ignore-scripts

# Copy the rest of the application code
COPY . .

# Build the React app for production
RUN pnpm run build

# Stage 2: Serve the app using NGINX
FROM nginx:stable-alpine

# Remove default NGINX website
RUN rm -rf /usr/share/nginx/html/*

# Copy the built files from the previous stage to the NGINX web directory
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80 for NGINX
EXPOSE 80

# Start the NGINX server
CMD ["nginx", "-g", "daemon off;"]
