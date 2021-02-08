FROM node:12-alpine
MAINTAINER JuseongPark juseongkr@gmail.com

RUN mkdir -p /docker_app

WORKDIR /docker_app

ADD ./ /docker_app

RUN npm install

CMD npm start
