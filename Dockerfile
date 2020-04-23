FROM node:lts-alpine

WORKDIR /opt/dap-web-utility

COPY package.json /opt/dap-web-utility/

RUN apk update && \
    apk add --no-cache bash build-base ruby ruby-dev ruby-etc ruby-bigdecimal ruby-json jq  openssh-client net-tools ca-certificates curl nano git python && \
    npm install --save && \
    gem install conjur-cli && \
    apk del build-base ruby-dev && \
    rm -rf /var/cache/apk/*

COPY bin/oc /usr/local/bin

EXPOSE 3000
COPY . /opt/dap-web-utility/

# Docker Client
RUN mkdir /opt/docker-cli && \
	wget -O /opt/docker-cli/release.tar.gz https://download.docker.com/linux/static/stable/x86_64/docker-19.03.8.tgz && \
	tar --strip-components=1 -xzvf  /opt/docker-cli/release.tar.gz -C /opt/docker-cli/ && \
	cp /opt/docker-cli/docker /usr/local/bin/ && \
	rm -rf /opt/docker-cli

#kubectl
RUN curl -LO https://storage.googleapis.com/kubernetes-release/release/`curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt`/bin/linux/amd64/kubectl && \
    mv kubectl /usr/local/bin/ && \
    chmod +x /usr/local/bin/kubectl

# OC Client
RUN mkdir /opt/oc && \
	mkdir /opt/oc/tmp && \
	wget -O /opt/oc/tmp/release.tar.gz https://github.com/openshift/origin/releases/download/v3.11.0/openshift-origin-client-tools-v3.11.0-0cbc58b-linux-64bit.tar.gz && \
	tar --strip-components=1 -xzvf /opt/oc/tmp/release.tar.gz -C /opt/oc/tmp/ && \
	mv /opt/oc/tmp/oc /opt/oc/ && \
	rm -rf /opt/oc/tmp

CMD node /opt/dap-web-utility/bin/www
