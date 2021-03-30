FROM node:12
WORKDIR /app

COPY ./package.json ./
COPY ./package-lock.json ./
RUN npm install --silent

COPY ./ ./

ENV PORT=5000
ENV MONGO_URI="mongodb://mongo:27017/glob3d"
EXPOSE 5000
CMD ["node", "app.js"]