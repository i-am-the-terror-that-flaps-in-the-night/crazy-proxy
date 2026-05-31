FROM node:20-alpine
WORKDIR /app
RUN apk add --no-cache libc6-compat
RUN npm install http-proxy
COPY server.js .
EXPOSE 10000
CMD ["node", "server.js"]
