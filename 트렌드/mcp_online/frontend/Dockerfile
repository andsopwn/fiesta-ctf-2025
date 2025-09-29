# 멀티스테이지 빌드 - 빌드 스테이지
FROM node:18-alpine AS builder

WORKDIR /app

# package.json과 lock 파일 복사
COPY package*.json ./

# 전체 의존성 설치 (빌드에는 devDependencies 필요)
RUN npm install

# 애플리케이션 코드 복사
COPY . .

# 프로덕션 빌드
RUN npm run build:prod

# 프로덕션 스테이지 - Nginx로 정적 파일 서빙
FROM nginx:alpine

# 빌드된 파일만 복사
COPY --from=builder /app/build /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

