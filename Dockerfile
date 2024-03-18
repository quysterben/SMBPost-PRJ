FROM node:18

LABEL author.name="ben" \
  author.email="quysterben@gmail.com"

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn --frozen-lockfile

COPY . .

RUN yarn build

CMD ["yarn", "dev"]