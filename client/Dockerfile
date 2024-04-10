FROM node:20-alpine

LABEL author.name="ben"

WORKDIR /app

COPY ["./package*.json","./"]

RUN npm ci

COPY . . 

CMD ["npm", "run", "start"]