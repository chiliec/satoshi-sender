FROM node:lts-slim

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

USER node

COPY --chown=node:node . .

RUN npm ci --omit=dev

CMD [ "npm", "run", "start" ]
