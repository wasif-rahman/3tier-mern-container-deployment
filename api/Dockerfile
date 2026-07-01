# Use official light-weight Node.js image
FROM node:22-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy application source code
COPY . .

# Expose application port
EXPOSE 5001

# Run the app
CMD ["node", "server.js"]
