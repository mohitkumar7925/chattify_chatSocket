FROM node:16

WORKDIR /usr/src/socket

COPY package*.json ./

RUN npm install

EXPOSE 4001
COPY . .

CMD [ "npm","start"] 




