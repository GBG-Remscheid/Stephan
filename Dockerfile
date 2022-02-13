FROM node:17 AS builder

WORKDIR /usr/src/Stephan

COPY . .

RUN npm ci &&  npx tsc

FROM node:alpine

WORKDIR /usr/src/Stephan

COPY --from=builder /usr/src/Stephan/build /usr/src/Stephan/package*.json ./

RUN apk add --no-cache python3 automake autoconf libtool make gcc g++

RUN npm ci --only=production --ignore-scripts && npm cache clean --force

USER node

CMD ["node", "Main.js"]