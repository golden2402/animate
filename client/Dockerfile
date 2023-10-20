FROM node:20.8.0-bullseye-slim AS build

WORKDIR /build

COPY . .

RUN yarn install
RUN yarn build

FROM node:20.8.0-bullseye-slim AS serve

WORKDIR /app

COPY --from=build /build/package.json ./package.json
COPY --from=build /build/node_modules ./node_modules
COPY --from=build /build/.next ./.next
COPY --from=build /build/public ./public

CMD ["yarn", "start"]
