FROM --platform=linux/amd64 node:20

WORKDIR /usr/src/tf-server

COPY package*.json ./

RUN npm install 
# TODO: change to ci

COPY . .

RUN npm run build

ENV PORT=8081

EXPOSE 8081

CMD [ "node", "dist/index.js" ]