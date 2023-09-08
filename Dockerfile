FROM node:18-alpine3.17

WORKDIR /home/node/app

COPY ./package.json ./
RUN npm install
COPY ./ ./

CMD ["npm", "run", "start"]