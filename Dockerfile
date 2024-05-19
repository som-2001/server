FROM node:latest

WORKDIR /usr/app/src

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3001

CMD ["node","index.js"]

