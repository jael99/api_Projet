# Use official Node.js LTS image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy Prisma schema and generate Prisma Client inside the container
COPY prisma ./prisma
RUN yarn prisma generate

# Copy application files
COPY . .

# Build the TypeScript application
RUN yarn build

# Expose port
EXPOSE ${PORT}

# Start the application
CMD ["node", "dist/index.js"]
