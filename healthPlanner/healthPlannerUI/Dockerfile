# Stage  1
FROM node:12.16-alpine as node

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

RUN chgrp -R 0 /usr/src/app/ && \
	chmod -R g=u /usr/src/app/

# Stage 2
FROM nginx:1.13.12-alpine

RUN rm -rf /etc/nginx/nginx.conf.default && rm -rf /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/nginx.conf /etc/nginx/conf.d/nginx.conf

## Remove default nginx index page
RUN rm -rf /usr/share/nginx/html/*

# Copy from the stahg 1
COPY --from=node /usr/src/app/dist/patientInformationApp /usr/share/nginx/html

RUN chmod -R 777 /var/log/nginx /var/cache/nginx /var/run \
     && chgrp -R 0 /etc/nginx \
     && chmod -R g+rwX /etc/nginx

EXPOSE 8080

LABEL io.openshift.expose-services="8080:http"

USER 1001
ENTRYPOINT ["nginx", "-g", "daemon off;"]
