
FROM node:18.12.0-buster-slim as build

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

RUN yarn build

ENV NODE_ENV production

RUN yarn install --prod --frozen-lockfile && yarn cache clean


FROM node:18.12.0-buster-slim as production

WORKDIR /main

COPY --chown=node:node --from=build /app/node_modules ./node_modules

COPY --chown=node:node --from=build /app/dist ./dist

EXPOSE 3000

CMD [ "node", "./dist/main.js" ]