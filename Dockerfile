FROM node:latest

MAINTAINER Nick Shevrov <nickshevr@gmail.com>

ENV API_SERVER_PORT "3040"
ENV API_SERVER_HOST "0.0.0.0"

ENV DB_NAME "hello"
ENV DB_USER "test"
ENV DB_PASSWORD "test"
ENV DB_HOST "localhost"

ENV SRC_DIR "/src"
ADD package.json /src/package.json
RUN cd /src && npm install

ADD . $SRC_DIR
WORKDIR $SRC_DIR

EXPOSE $API_SERVER_PORT

CMD ["start"]
ENTRYPOINT ["npm"]
