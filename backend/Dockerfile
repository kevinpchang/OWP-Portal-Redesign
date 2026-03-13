FROM php:8.2-apache

RUN a2enmod rewrite

# Set the Apache web root
ENV APACHE_DOCUMENT_ROOT=/var/www/html/src/api

RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf \
 && sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf

COPY . /var/www/html