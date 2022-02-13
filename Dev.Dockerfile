FROM node:17

WORKDIR /usr/src/Stephan

COPY package*.json ./

RUN npm ci

COPY . ./

RUN npx tsc

CMD ["npm", "run", "start"]