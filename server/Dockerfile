# Base step(installing prod dependencies)
FROM node:18-alpine as base

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn --production

# Build step(testing and bulding)
FROM base as build

RUN yarn # installing dev dependencies

COPY tsconfig.json tsconfig.build.json .eslintrc.yml .prettierrc.yml .mocharc.yml ./
COPY src ./src

RUN yarn lint && yarn test:unit
RUN yarn build

# Delivery step(builded client)
FROM base as delivery

WORKDIR /app

COPY --from=build /app/build ./build

CMD ["yarn", "start:prod"]
