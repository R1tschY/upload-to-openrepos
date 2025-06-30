FROM node:22-bookworm

RUN npm install
RUN npx -y playwright@latest install --with-deps firefox

COPY index.js /opt/openrepos-playwright/index.js

USER node
WORKDIR /home/node
ENTRYPOINT ["node", "/opt/openrepos-playwright/index.js"]