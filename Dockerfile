FROM node:8
MAINTAINER Ryan D. Watts <ryandwatts@gmail.com>

ADD . /src
WORKDIR /src

EXPOSE 8000
EXPOSE 3000