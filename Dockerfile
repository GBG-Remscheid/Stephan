FROM --platform=arm64 node:latest

WORKDIR /usr/local/DimitriTS

COPY . /usr/local/DimitriTS/

RUN apt update & apt upgrade -y
RUN npm i -g ts-node & npm ci

CMD ["npm", "start"]