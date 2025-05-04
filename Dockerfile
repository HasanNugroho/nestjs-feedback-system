# use base image
FROM node:23-alpine

# Set working directory
WORKDIR /app

# copy package json
COPY package*.json ./

# Install dependencies
RUN npm install 

# copy source code
COPY . .

# Build application
RUN npm run build

# Default command for running application
CMD ["node", "dist/src/main.js"]
