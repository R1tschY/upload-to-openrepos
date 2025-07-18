FROM mcr.microsoft.com/playwright:v1.54.0-noble

RUN mkdir -p /opt/openrepos-playwright

COPY package.json package-lock.json /opt/openrepos-playwright/
RUN cd /opt/openrepos-playwright && npm ci
COPY index.js /opt/openrepos-playwright/index.js

USER pwuser
WORKDIR /home/pwuser

ENTRYPOINT ["node", "/opt/openrepos-playwright/index.js"]