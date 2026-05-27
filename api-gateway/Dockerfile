FROM nginx:alpine

# Install gettext for envsubst
RUN apk add --no-cache gettext

COPY nginx.conf.template /etc/nginx/nginx.conf.template

EXPOSE 8080

# At startup: substitute env vars into template, then start nginx
CMD ["/bin/sh", "-c", \
  "envsubst '${AUTH_SERVICE_HOST} ${COURSE_SERVICE_HOST} ${ORDER_SERVICE_HOST} ${FRONTEND_ORIGIN}' \
  < /etc/nginx/nginx.conf.template \
  > /etc/nginx/nginx.conf && nginx -g 'daemon off;'"]
