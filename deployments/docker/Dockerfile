FROM node:16.5.0-alpine3.11 AS development

WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn add glob rimraf

RUN yarn install --only=development

COPY . .

RUN yarn build

FROM node:16.5.0-alpine3.11 as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production

COPY . .

COPY --from=development /usr/src/app/dist ./dist

CMD node ./dist/main.js