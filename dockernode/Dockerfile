FROM node
WORKDIR workspace/nodeapplication
COPY package.json .
RUN npm install
COPY . .
CMD ["node", "app.js"]


