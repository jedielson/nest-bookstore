FROM node:16.5.0-alpine3.11 AS development

WORKDIR /app

COPY package.json .

RUN yarn install

COPY . .

RUN yarn build

EXPOSE 3000

USER node

CMD yarn test