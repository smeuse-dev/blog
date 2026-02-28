# ===== Stage 1: Base =====
# 공통 베이스 이미지 (Node.js Alpine)
FROM node:22-alpine AS base
WORKDIR /app

# ===== Stage 2: Dependencies =====
# package.json/lock 변경 시에만 재실행 (캐시 레이어)
FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci

# ===== Stage 3: Builder =====
# deps의 node_modules 참조 + 소스만 복사해서 빌드
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY package.json package-lock.json* ./
COPY tsconfig.json next.config.ts postcss.config.mjs next-env.d.ts ./
COPY src/ ./src/
COPY content/ ./content/
COPY public/ ./public/
RUN npm run build

# ===== Stage 4: Runner =====
# 빌드 결과만 복사해서 실행 (최소 이미지)
FROM base AS runner
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# 빌드 결과물만 복사
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Content dir — 볼륨 마운트용 (포스트 핫스왑)
RUN mkdir -p /app/content/posts /app/content/posts/ko && chown -R nextjs:nodejs /app/content

# Analytics data dir — 볼륨 마운트용 (DB 영속성)
RUN mkdir -p /app/data && chown -R nextjs:nodejs /app/data

USER nextjs
EXPOSE 3001
ENV PORT=3001
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
