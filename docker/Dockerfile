#───────────────────────────────
# Build
#───────────────────────────────

FROM node:26-alpine as builder
WORKDIR /app
COPY ./package*.json ./
COPY ./translation/package*.json ./translation/
COPY ./kernel/package*.json ./kernel/
COPY ./core/package*.json ./core/
COPY ./ext/couchdb-store/package*.json ./ext/couchdb-store/
COPY ./platform/package*.json ./platform/
COPY ./client/package*.json ./client/
COPY ./backend/package*.json ./backend/
COPY ./frontend/package*.json ./frontend/
COPY ./shell/package*.json ./shell/
RUN --mount=type=cache,target=/root/.npm  npm ci
COPY . .
RUN npm --workspace=translation run build \
 && npm --workspace=kernel run build \
 && npm --workspace=core run build \
 && npm --workspace=ext/couchdb-store run build \
 && npm --workspace=platform run build \
 && npm --workspace=client run build \
 && npm --workspace=backend run build \
 && npm --workspace=frontend run build

RUN npm prune --omit=dev

#───────────────────────────────
# RUNTIME
#───────────────────────────────

FROM node:26-alpine
WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/translation/package*.json ./translation/
COPY --from=builder /app/kernel/package*.json ./kernel/
COPY --from=builder /app/core/package*.json ./core/
COPY --from=builder /app/ext/couchdb-store/package*.json ./ext/couchdb-store/
COPY --from=builder /app/platform/package*.json ./platform/
COPY --from=builder /app/client/package*.json ./client/
COPY --from=builder /app/backend/package*.json ./backend/
COPY --from=builder /app/frontend/package*.json ./frontend/
COPY --from=builder /app/shell/package*.json ./shell/

COPY --from=builder /app/node_modules ./node_modules/

COPY --from=builder /app/translation/dist/ ./translation/dist/
COPY --from=builder /app/kernel/dist/ ./kernel/dist/
COPY --from=builder /app/core/dist/ ./core/dist/
COPY --from=builder /app/ext/couchdb-store/dist/ ./ext/couchdb-store/dist/
COPY --from=builder /app/platform/dist/ ./platform/dist/
COPY --from=builder /app/client/dist/ ./client/dist/
COPY --from=builder /app/backend/dist/ ./backend/dist/
COPY --from=builder /app/frontend/dist/ ./frontend/dist/
#COPY --from=builder /app/shell/dist/ ./shell/dist/

#RUN npm ci --omit=dev

COPY ./docker/backend/config.json ./backend/

WORKDIR /app/backend
ENV NODE_ENV=production
EXPOSE 9101 
CMD ["node", "dist/main.js"]
