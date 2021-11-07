FROM --platform=linux/amd64 node:latest

WORKDIR /usr/src/Stephan

COPY package*.json ./

RUN npm i --only=production
RUN npm i -g typescript

COPY . ./

RUN tsc

CMD ["npm", "run", "start"]