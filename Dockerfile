FROM node:22-bookworm

ARG PLAYWRIGHT_VERSION=1.53.1

RUN npx -y playwright@${PLAYWRIGHT_VERSION} install-deps firefox
RUN mkdir -p /opt/openrepos-playwright \
    && chown node:node /opt/openrepos-playwright

USER node
WORKDIR /home/node

RUN npx -y playwright@${PLAYWRIGHT_VERSION} install firefox

COPY package.json package-lock.json /opt/openrepos-playwright/
RUN cd /opt/openrepos-playwright && npm ci
COPY index.js /opt/openrepos-playwright/index.js

ENTRYPOINT ["node", "/opt/openrepos-playwright/index.js"]