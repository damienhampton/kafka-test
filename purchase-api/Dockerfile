FROM node
WORKDIR /app
COPY package.* .
RUN yarn
COPY . .
CMD ["yarn", "start"]