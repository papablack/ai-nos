FROM nginx:latest

RUN apt-get update && apt-get install -y \
    libpango1.0-dev \
    libcairo2-dev \
    libjpeg-dev \    
    libgif-dev \ 
    build-essential \
    g++ \
    libgif-dev;

COPY sites/default.conf /etc/nginx/conf.d/

RUN mkdir /var/.startup
COPY install.sh /var/.startup/install.sh
RUN sh /var/.startup/install.sh
COPY install.sh /var/.startup/install.sh

RUN curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.34.0/install.sh | bash

ENV NODE_VERSION=16.11.1

ENV NVM_DIR=/root/.nvm

RUN /bin/bash -c "source ~/.profile"

RUN . "$NVM_DIR/nvm.sh" && nvm install ${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm use v${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm alias default v${NODE_VERSION}
ENV PATH="/root/.nvm/versions/node/v${NODE_VERSION}/bin/:${PATH}"
RUN node --version
RUN npm --version

RUN npm install yarn -g

WORKDIR /app

COPY ./entrypoint.sh /var/.startup/entrypoint.sh
RUN dos2unix /var/.startup/entrypoint.sh
RUN ["chmod", "+x", "/var/.startup/entrypoint.sh"]

ENTRYPOINT [ "/var/.startup/entrypoint.sh" ]
