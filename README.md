This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

### 방법 1: Vercel 웹사이트를 통한 배포 (권장)

1. [Vercel](https://vercel.com)에 가입하고 로그인합니다.
2. "New Project" 버튼을 클릭합니다.
3. GitHub, GitLab, 또는 Bitbucket에서 이 프로젝트를 import합니다.
4. 프로젝트 설정에서 다음 환경 변수를 추가합니다:
   - `NEXT_PUBLIC_SUPABASE_URL`: `https://cqxduukezbedattyvsky.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxeGR1dWtlemJlZGF0dHl2c2t5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzNTM3NzcsImV4cCI6MjA2NjkyOTc3N30.qob76qhvDLn9mAQXOk07DYiRst1eJxY9PDbDgyR0pWg`
5. "Deploy" 버튼을 클릭합니다.

### 방법 2: Vercel CLI를 통한 배포

1. Node.js를 설치합니다: [https://nodejs.org](https://nodejs.org)
2. Vercel CLI를 설치합니다:
   ```bash
   npm install -g vercel
   ```
3. 프로젝트 디렉토리에서 다음 명령어를 실행합니다:
   ```bash
   vercel
   ```
4. 프롬프트에 따라 설정을 완료합니다.

### 환경 변수 설정

배포 시 다음 환경 변수가 필요합니다:
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase 프로젝트 URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase 익명 키

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
