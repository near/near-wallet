# syntax=docker/dockerfile-upstream:experimental

FROM phusion/baseimage:0.11

RUN curl -o /tmp/node_setup.sh "https://deb.nodesource.com/setup_11.x"
RUN bash /tmp/node_setup.sh
RUN curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo 'deb https://dl.yarnpkg.com/debian/ stable main' | tee /etc/apt/sources.list.d/yarn.list
RUN apt-get update -qq && apt-get install -y \
    nodejs \
    nginx \
    rsync

# Set up 
RUN mkdir /near-wallet
WORKDIR /near-wallet
# We'll replace the sites-enabled down below
RUN rm /etc/nginx/sites-enabled/default

# 'npm install' takes ~3 minutes, so copy just the package.json and do an install before we copy the rest of the code
#   so that Docker will cache these instructions so long as package.json isn't changed
COPY package.json .
RUN npm install

# Now, copy the rest of the code for the build
COPY . .
RUN mkdir -p /var/www/html/wallet
COPY /scripts/wallet.nginx /etc/nginx/sites-enabled/wallet
COPY /scripts/init_nginx.sh /etc/my_init.d/

# NOTE1: Because the Wallet uses Parcel for its build and environment variables in Parcel can only be set at build time, we run an 'npm build'
#  as part of container startup so that the Wallet will respond to environment variables set on container startup
# NOTE2: The last command, /sbin/my_init, is the command to run the NginX server bundled inside the phusion base image
#  See https://hub.docker.com/layers/phusion/baseimage/0.11/images/sha256-14e6c478b00aa0a6f68391a53f7d510d9a062efcf509ea55ee9a125969592b79?context=explore for more details
CMD bash -c "./scripts/generate_env_file_for_build_inside_docker.sh && \
    npm run build && \
    rsync -ar /near-wallet/dist/ /var/www/html/wallet && \
    /sbin/my_init"
