FROM node:14
WORKDIR /app

COPY ./package.json ./
COPY ./package-lock.json ./
RUN npm install --silent

COPY ./ ./
RUN npm run build

RUN npm install -g serve
EXPOSE 3000
CMD ["serve", "-s", "build", "-l", "3000"]