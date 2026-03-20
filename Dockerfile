FROM node:18

WORKDIR /app
COPY server ./server
COPY client ./client
WORKDIR /app/server

RUN npm install

CMD ["node", "server.js"]