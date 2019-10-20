FROM node:8-alpine

WORKDIR /usr/src/app

ENV PRODUCTION=true
ENV POSTGRES_DB=forge
ENV POSTGRES_USERNAME=forge
ENV POSTGRES_PASSWORD=forge
ENV POSTGRES_HOST=localhost
ENV POSTGRES_PORT=5432
ENV SALT_ROUNDS=10
ENV JWT_PUBLIC=/usr/src/app/.PUBLIC_KEY
ENV JWT_PRIVATE=/usr/src/app/.PRIVATE_KEY
ENV PORT=4000

# Install deps
RUN npm i -g ts-node
COPY package.json yarn.lock ./
RUN apk --no-cache add --virtual builds-deps build-base python
RUN yarn

RUN mkdir public
RUN mkdir public/img

COPY . .

EXPOSE ${PORT}

CMD [ "yarn", "start" ]