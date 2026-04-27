# syntax=docker/dockerfile:1
# Production image without Nixpacks (avoids flaky GitHub tarball fetches for nixpkgs during Railway builds).
#
# Stage 1: build Vite assets with official Node image.
# Stage 2: PHP CLI + extensions (GD for image compression, PDO MySQL, etc.).

FROM node:22-bookworm AS frontend
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --prefer-offline --no-audit
COPY . .
RUN npm run build && npm run build:copy-manifest \
    && (test -f public/build/manifest.json || cp public/build/.vite/manifest.json public/build/manifest.json)

FROM php:8.4-cli-bookworm AS app

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        git \
        unzip \
        libicu-dev \
        libxml2-dev \
        libpng-dev \
        libjpeg62-turbo-dev \
        libfreetype6-dev \
        libzip-dev \
        libonig-dev \
    && rm -rf /var/lib/apt/lists/*

RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j"$(nproc)" \
        pdo_mysql \
        mbstring \
        zip \
        intl \
        xml \
        dom \
        gd \
        opcache

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

# Warm Composer layer when only lockfiles change
COPY composer.json composer.lock ./
RUN composer install \
        --no-dev \
        --no-interaction \
        --prefer-dist \
        --optimize-autoloader \
        --no-scripts

COPY . .
COPY --from=frontend /app/public/build ./public/build

RUN composer install \
        --no-dev \
        --no-interaction \
        --prefer-dist \
        --optimize-autoloader \
    && mkdir -p storage/framework/{sessions,views,cache} storage/logs bootstrap/cache \
    && chmod -R ug+rwx storage bootstrap/cache \
    && chmod +x scripts/railway-start.sh

ENV PORT=8000
EXPOSE 8000

# Do not chain route:cache (closure routes). See scripts/railway-start.sh.
CMD ["sh", "scripts/railway-start.sh"]
