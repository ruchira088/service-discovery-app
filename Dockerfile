FROM node:6.9.4

WORKDIR /user/development/service-discovery
COPY ./package.json .

RUN npm install

COPY . .

EXPOSE 8008 5868

ENTRYPOINT ["npm", "run"]
CMD ["dev"]