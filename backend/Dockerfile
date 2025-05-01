FROM node:23.7.0

WORKDIR /app

COPY package*.json .

RUN npm ci --only=prouction

COPY . .

EXPOSE 5000

CMD [ "node", "./bin/www" ]
