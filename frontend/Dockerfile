FROM node
WORKDIR /app
COPY package.* .
RUN npm i
COPY . .
CMD ["npm", "start"]