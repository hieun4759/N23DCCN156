# NextAuth Exercise (Nhóm 9)

## Mục tiêu

- Đăng nhập bằng **CredentialsProvider** (NextAuth) và lưu 2 token:
  - `accessToken`: sống **60 giây**
  - `refreshToken`: sống **1 ngày** (demo)
- Phân quyền truy cập:
  - Trang **Dashboard (`/`)** chỉ cho phép `ROLE_ADVISOR`
  - Nếu `ROLE_STUDENT` → hiển thị **“Bị từ chối truy cập”**
  - Nếu chưa đăng nhập → redirect về `/login`
- Demo token hết hạn:
  - Bấm nút **“Lấy danh sách lớp”** để gọi API có kiểm tra `accessToken`
  - Khi `accessToken` hết hạn, NextAuth sẽ tự refresh bằng `refreshToken` (diễn ra “dưới nền”)

## Tài khoản test

- `student` / `123456` → `ROLE_STUDENT`
- `advisor` / `123456` → `ROLE_ADVISOR`

## Cách chạy

```bash
npm install
npm run dev
```

Mở `http://localhost:3000`.

## Cấu trúc chính

- `pages/login.js`: trang đăng nhập
- `pages/index.js`: Dashboard + demo gọi API
- `pages/api/auth/[...nextauth].js`: cấu hình NextAuth (Credentials)
- `lib/auth.js`: callback `jwt()` + `session()` (lưu token + auto refresh)
- Mock backend (giả lập):
  - `pages/api/mock/login.js`
  - `pages/api/mock/refresh.js`
  - `pages/api/mock/classes.js`
- API gọi “backend” có phân quyền:
  - `pages/api/classes.js`

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/pages/api-reference/create-next-app).

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

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/pages/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn-pages-router) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/pages/building-your-application/deploying) for more details.
