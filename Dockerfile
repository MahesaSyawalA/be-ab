FROM node:24-slim
WORKDIR /app
ENV NODE_ENV=production

# devDependencies needed at runtime: tsx (runs TS), prisma (migrate)
COPY package*.json ./
RUN npm ci --include=dev

COPY . .
# prisma 7 config reads DATABASE_URL at load time; dummy value is enough to generate the client
RUN DATABASE_URL="mysql://x:x@localhost:3306/x" npx prisma generate

EXPOSE 3001
CMD ["sh", "-c", "npx prisma migrate deploy && npx tsx src/server.ts"]
