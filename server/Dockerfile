FROM node:14
WORKDIR /app

COPY ./package.json ./
COPY ./package-lock.json ./
RUN npm install --silent

COPY ./ ./

ENV PORT=5000
ENV WS_PORT=8080
ENV MONGO_URI="mongodb://mongo:27017/glob3d"
ENV HTTPS=true
EXPOSE 5000
EXPOSE 8080
CMD ["node", "app.js"]