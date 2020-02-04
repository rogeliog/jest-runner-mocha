ARG NODE_VERSION=8
FROM node:${NODE_VERSION}

WORKDIR /app

RUN npm i

COPY . .

CMD ["npm", "test"]
