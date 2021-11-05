FROM node:latest

WORKDIR /usr/src/Stephan

COPY package*.json ./

RUN npm i --only=production
RUN npm i -g tsc

COPY . ./

RUN tsc

CMD ["npm", "run", "start"]