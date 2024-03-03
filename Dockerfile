# Use a Node.js base image
FROM node:16.4.2

# Install necessary Linux packages
RUN apt-get update && apt-get install -y \
    mesa-utils \
    xvfb \
    libgl1-mesa-dri \
    libglapi-mesa \
    libosmesa6

# Create a directory for your application
WORKDIR /app

# Copy your application files into the container
COPY . .

# Install dependencies
RUN npm install

# Set up environment variables
ENV DISPLAY=:99.0

# Start xvfb before running the application
CMD Xvfb :99 -ac & npm run start:live