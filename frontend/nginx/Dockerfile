FROM nginx:1.20.1

RUN rm /etc/nginx/conf.d/default.conf
COPY default.conf /etc/nginx/conf.d
CMD ["/usr/sbin/nginx", "-g", "daemon off;", "-c", "/etc/nginx/conf.d/default.conf"]
