FROM 10.30.254.74:5001/library/nginx:1.21.6

ARG PROFILE
ARG VIRTUAL_PATH=oa

RUN echo "PWD is: $PWD"

ADD ./dist/ /usr/share/nginx/html/${VIRTUAL_PATH}/
COPY ./src/nginx/nginx-${PROFILE}.conf /etc/nginx/conf.d/default.conf
COPY ./src/nginx/.htpasswd /etc/apache2/.htpasswd

EXPOSE 8037
#EXPOSE 443
