FROM node:19 AS builder

WORKDIR /usr/src/Stephan

COPY . .

RUN yarn --immutable && yarn build

FROM node:alpine

WORKDIR /usr/src/Stephan

COPY --from=builder /usr/src/Stephan/build /usr/src/Stephan/package.json ./

RUN apk add --no-cache python3 automake autoconf libtool make gcc g++ && \
    yarn workspaces focus --all --production && \
    # yarn cache clean && \
    apk del python3 automake autoconf libtool make gcc g++

USER node

CMD ["node", "Main.js"]
