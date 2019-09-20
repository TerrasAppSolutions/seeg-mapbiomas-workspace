FROM node:9

LABEL authors="Pedro Ramos"

# Create a directory where our app will be placed
RUN mkdir -p /home/app

WORKDIR /home/app

COPY package.json /home/app

RUN npm install --quiet
# ADD start.sh /home/app/start.sh

# Change directory so that our commands run inside this new directory