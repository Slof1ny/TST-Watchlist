FROM node:18-alpine

# Create app directory
WORKDIR /app

# Create data dir for persistence (optional bind/volume at runtime)
RUN mkdir -p /data && chown node:node /data
ENV DATA_DIR=/data

# Install dependencies
COPY package.json ./
RUN npm install --production && npm cache clean --force

# Copy app files
COPY index.js ./
COPY index.html ./

# Switch to non-root
USER node

# Expose port
EXPOSE 8585

# Start server
CMD ["node", "index.js"]
