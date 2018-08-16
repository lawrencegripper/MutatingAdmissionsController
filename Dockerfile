FROM node:8
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm test
RUN npm run build-server
CMD ["npm", "start"]