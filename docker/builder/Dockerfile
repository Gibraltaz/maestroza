FROM node:26-alpine as maestrozo_builder
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

FROM scratch
COPY --from=maestrozo_builder /app/ /app/
