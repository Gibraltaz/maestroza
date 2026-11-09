FROM builder as build
FROM node:26-alpine as maestrozo_backend
WORKDIR /app

COPY --from=build /app/package*.json ./
COPY --from=build /app/translation/package*.json ./translation/
COPY --from=build /app/kernel/package*.json ./kernel/
COPY --from=build /app/core/package*.json ./core/
COPY --from=build /app/ext/couchdb-store/package*.json ./ext/couchdb-store/
COPY --from=build /app/platform/package*.json ./platform/
COPY --from=build /app/client/package*.json ./client/
COPY --from=build /app/backend/package*.json ./backend/
COPY --from=build /app/frontend/package*.json ./frontend/
COPY --from=build /app/shell/package*.json ./shell/

COPY --from=build /app/node_modules ./node_modules/

COPY --from=build /app/translation/dist/ ./translation/dist/
COPY --from=build /app/kernel/dist/ ./kernel/dist/
COPY --from=build /app/core/dist/ ./core/dist/
COPY --from=build /app/ext/couchdb-store/dist/ ./ext/couchdb-store/dist/
COPY --from=build /app/platform/dist/ ./platform/dist/
COPY --from=build /app/client/dist/ ./client/dist/
COPY --from=build /app/backend/dist/ ./backend/dist/
COPY --from=build /app/frontend/dist/ ./frontend/dist/
#COPY --from=builder /app/shell/dist/ ./shell/dist/


COPY ./docker/backend/config.json ./backend/

ENV NODE_ENV=production
EXPOSE 9101 
WORKDIR /app/backend
CMD ["node", "dist/main.js"]
