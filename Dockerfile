FROM --platform=linux/amd64 node:latest AS builder

WORKDIR /usr/src/Stephan

COPY . .

RUN npm ci &&  npx tsc

FROM node:alpine

COPY --from=builder /usr/src/Stephan/build /usr/src/Stephan/package*.json ./

RUN apk add python3 automake autoconf libtool make gcc g++
RUN npm ci --only=production --ignore-scripts && npm cache clean --force

CMD ["node", "Main.js"]