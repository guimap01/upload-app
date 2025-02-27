FROM node:20.18 AS dependencies

# Defines the working directory
WORKDIR /usr/src/app 

COPY package.json yarn.lock ./

RUN yarn

FROM dependencies as build
WORKDIR /usr/src/app 
COPY . .
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
RUN yarn build

FROM node:20-alpine3.21

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/package.json ./package.json
COPY --from=build /usr/src/app/node_modules ./node_modules

ENV CLOUDFLARE_ACCOUNT_ID=""
ENV CLOUDFLARE_ACCESS_KEY_ID=""
ENV CLOUDFLARE_SECRET_ACCESS_KEY=""
ENV CLOUDFLARE_BUCKET=""
ENV CLOUDFLARE_PUBLIC_URL="https://pub.r2.dev"

EXPOSE 3333

CMD ["yarn", "start"]