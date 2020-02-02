ARG NODE_VERSION=8
FROM node:${NODE_VERSION}

WORKDIR /app

COPY package.json npm-shrinkwrap.json /app/

RUN npm ci

COPY . .

CMD ["yarn", "test"]
