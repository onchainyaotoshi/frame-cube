FROM node:16.4.2

RUN apt-get update && apt-get install -y \
    mesa-utils \
    xvfb \
    libgl1-mesa-dri \
    libglapi-mesa \
    libosmesa6
