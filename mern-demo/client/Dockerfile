
# Stage 1: Build React App
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Stage 2: Serve React App bằng Nginx
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

# CÂU 32: Sao chép cấu hình Nginx Reverse Proxy
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
