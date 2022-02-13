## Stage 1 - Lets build the "deployable package"
FROM node:10.19.0-alpine as frontend-build
WORKDIR /frontend

# Step 1 - Download all package dependencies first.
# We will redownload dependencies only when packages change.
COPY ./user-interface-service/src/main/webapp/estock-ui/package.json ./user-interface-service/src/main/webapp/estock-ui/package-lock.json ./
RUN npm install

# Step 2 - Copy all source and run build
COPY ./user-interface-service/src/main/webapp/estock-ui/. .
RUN npm run build

## Stage 2 - Let's build a minimal image with the "deployable package"
FROM nginx:1.12-alpine
COPY --from=frontend-build ./frontend/build /usr/share/nginx/html
EXPOSE 80
COPY ./user-interface-service/src/main/webapp/estock-ui/nginx.conf /etc/nginx/conf.d/default.conf
CMD ["nginx", "-g", "daemon off;"]


#docker build -f user-interface-service/src/main/webapp/estock-ui/Dockerfile -t vinayak96/estock_frontend .