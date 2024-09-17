# Use Node.js official image as a base
FROM node:20

# Set the working directory for the frontend
WORKDIR /usr/src/app/frontend

# Copy root package.json and yarn.lock
COPY package.json yarn.lock /usr/src/app/

# Install dependencies from the root
RUN yarn

# Copy only the frontend files to avoid overwriting node_modules
COPY frontend/ ./

# Expose the frontend port
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=development

# Command to run the frontend
CMD ["yarn", "dev:frontend"]
