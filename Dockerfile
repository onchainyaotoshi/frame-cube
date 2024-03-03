# Use a Node.js base image
FROM node:16.4.2
WORKDIR /app

# Install necessary Linux packages
RUN apt-get update && apt-get install -y \
    mesa-utils \
    xvfb \
    libgl1-mesa-dri \
    libglapi-mesa \
    libosmesa6

# Copy your application files
COPY . .

# Set up environment variables
ENV DISPLAY=:99.0

# Start xvfb before running the application
CMD Xvfb :99 -ac & npm run start:live