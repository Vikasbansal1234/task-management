# Stage 1: Build the NestJS app
FROM node:18-alpine AS build

# Set the working directory
WORKDIR /app

# Copy over package.json and pnpm-lock.yaml files
COPY package.json pnpm-lock.yaml ./

# Install pnpm globally
RUN npm install -g pnpm

# Install dependencies and skip scripts that may cause issues
RUN pnpm install --ignore-scripts

# Copy the rest of the application code
COPY . .

# Build the NestJS app for production
RUN pnpm run build

# Stage 2: Create the production environment
FROM node:18-alpine AS production

# Set the working directory
WORKDIR /app

# Copy the built files from the previous stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/pnpm-lock.yaml ./pnpm-lock.yaml

# Install only production dependencies without scripts
RUN npm install -g pnpm && pnpm install --prod --ignore-scripts

# Expose the necessary port
EXPOSE 3000

# Command to run the application in production mode
CMD ["node", "dist/main"]
