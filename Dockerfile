FROM node:16-alpine

ENV NODE_ENV production
ENV API_PORT 4000
ENV MONGODB_URI mongodb://mongodb-service/osop
ENV SESSION_SECRET keyboard cat

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

EXPOSE 4000

CMD ["node", "server.js"]