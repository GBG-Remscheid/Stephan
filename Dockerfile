FROM node:18 AS builder

WORKDIR /usr/src/Stephan

COPY . .

RUN npm ci && npm run build

FROM node:alpine

WORKDIR /usr/src/Stephan

COPY --from=builder /usr/src/Stephan/build /usr/src/Stephan/package*.json ./

RUN apk add --no-cache python3 automake autoconf libtool make gcc g++ && \
    npm ci --only=production --ignore-scripts && \
    npm cache clean --force && \
    apk del python3 automake autoconf libtool make gcc g++

USER node

CMD ["node", "Main.js"]