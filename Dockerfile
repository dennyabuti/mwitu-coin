FROM node

RUN npm install -g yarn

RUN mkdir /app

COPY ./app /app

COPY ./entrypoint.sh /

EXPOSE 4040
WORKDIR /app
# ENTRYPOINT ["/entrypoint.sh"]
ENTRYPOINT yarn start