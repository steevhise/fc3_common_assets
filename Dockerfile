FROM node:6.11.3
LABEL author="Ryan D. Watts"

ADD . /src
WORKDIR /src

RUN npm i

EXPOSE 8000
EXPOSE 3000