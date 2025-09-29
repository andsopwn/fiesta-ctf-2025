FROM mysql:8.0

# MySQL 환경변수 설정
ENV MYSQL_DATABASE=financial_library
ENV MYSQL_USER=financialuser
ENV MYSQL_PASSWORD=financialpass
ENV MYSQL_ROOT_PASSWORD=rootpass

COPY init.sql /docker-entrypoint-initdb.d/
COPY my.cnf /etc/mysql/conf.d/

# 포트 노출
EXPOSE 3306
