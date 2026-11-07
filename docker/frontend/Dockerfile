FROM maestrozo-build as build
FROM nginx:alpine
COPY --from=build /app/frontend/dist/ /usr/share/nginx/html/
COPY ./docker/frontend/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
WORKDIR /app/frontend
CMD ["nginx", "-g", "daemon off;"]
