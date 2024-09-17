# Use Node.js official image as a base
FROM node:20

# Set the working directory for the backend
WORKDIR /usr/src/app/backend

# Copy root package.json and yarn.lock
COPY package.json yarn.lock /usr/src/app/

# Install dependencies from the root
RUN yarn

# Copy only the backend files to avoid overwriting node_modules
COPY backend/ ./

# Expose the backend port
EXPOSE 5000

# Set environment variables
ENV NODE_ENV=development

# Command to run the backend
CMD ["yarn", "dev:backend"]
