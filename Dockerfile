FROM node:latest

WORKDIR /usr/src/DimitriTS

COPY package*.json .

RUN npm i --only=producion

COPY . .

CMD ["npm", "run", "dev"]