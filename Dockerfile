FROM library/node:latest

COPY . /app

WORKDIR /app

RUN npm install

EXPOSE 9090

ENTRYPOINT node --experimental-modules index.mjs