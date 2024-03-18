FROM node:20-alpine

LABEL author.name="ben"

WORKDIR /app
COPY ["./package*.json","./"]
RUN npm install
COPY . . 

CMD ["npm", "run", "start"]