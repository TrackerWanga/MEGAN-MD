FROM node:18-bullseye-slim

# Install ffmpeg for media processing
RUN apt-get update && apt-get install -y \
    ffmpeg \
    git \
    && rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy app source
COPY . .

# Create required directories
RUN mkdir -p sessions database temp logs

# Set environment
ENV NODE_ENV=production

# Start command
CMD ["node", "index.js"]