FROM node:22-alpine

ENV NODE_ENV=production

WORKDIR /app/auth-backend

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --chown=node:node . .

USER node

EXPOSE 5000

CMD ["npm", "start"]