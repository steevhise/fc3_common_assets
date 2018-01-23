FROM node:8.7.0
LABEL author="Ryan D. Watts"

ADD . /src
WORKDIR /src

RUN npm i
RUN npm i -g node-gyp
RUN node-gyp rebuild

EXPOSE 8000
EXPOSE 3000