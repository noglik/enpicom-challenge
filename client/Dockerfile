# Base step(testing and building)
FROM node:18-alpine as base

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn

COPY tsconfig.json ./
COPY public ./public
COPY src ./src

RUN yarn test --watchAll=false # linting would also go here
RUN yarn build

# Delivery step(builded client)
FROM alpine:3.16.2 as delivery

WORKDIR /app

COPY --from=base /app/build ./

CMD ["ls"]
