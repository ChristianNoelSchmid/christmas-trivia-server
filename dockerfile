#stage 1
FROM node:latest as builder
WORKDIR /usr/src/app
COPY package.json package-lock.json ./

RUN npm install
COPY . .

RUN npm run deploy

#stage 2
FROM nginx:alpine
COPY --from=builder /usr/src/app/dist/ /usr/share/nginx/html