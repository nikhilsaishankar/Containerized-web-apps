FROM node:17-alpine
WORKDIR node-application/
COPY package.json .
RUN npm install
COPY . .
CMD ["node" , "server.js"]
