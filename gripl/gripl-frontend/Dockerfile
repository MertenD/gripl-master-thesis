FROM node:18-alpine AS builder
WORKDIR /app

ARG API_BASE_URL

COPY package*.json ./
RUN npm ci --force

COPY . .

ENV API_BASE_URL=$API_BASE_URL
RUN npm run build

RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["npm", "start"]
