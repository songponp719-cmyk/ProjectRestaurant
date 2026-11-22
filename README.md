# Restaurant Management System

## เทคโนโลยีที่ใช้

- **Core Framework:** Next.js
- **Frontend & UI:** React, TypeScript, Tailwind CSS
- **Backend & API:** Next.js Route Handlers, Node.js
- **Database & ORM:** MySQL, Prisma ORM
- **Infrastructure & Tools:** Docker, MinIO, phpMyAdmin


## สิ่งที่ต้องติดตั้ง

- Node.js
- Docker Desktop
- Git

## การติดตั้งโปรเจค

เปลี่ยนไฟล์ .env.example เป็น .env

### 1. ติดตั้ง Dependencies

```bash
npm install
```

### 2. สร้าง Prisma Client

```bash
npx prisma generate
```

### 3. เปิดบริการ Docker

```bash
docker compose up -d
```

### 4. สร้างโครงสร้างฐานข้อมูล

```bash
npx prisma migrate deploy
```

### 5. นำเข้าบัญชีแอดมินลง Database

```bash
npm run db:seed:platform
```

### 7. สร้าง MinIO Bucket

```bash
npm run minio:init
```

คำสั่งนี้จะสร้าง Bucket ชื่อ `products` สำหรับจัดเก็บรูปภาพเมนู และสามารถรันซ้ำได้โดยไม่ลบรูปเดิม


```

## นำเข้าข้อมูลร้านจำลองลง Database

สำหรับบัญชีสร้างร้านจำลอง บัญชีเจ้าของร้าน เมนู ตัวเลือกเสริมพร้อมสูตรตัดสต็อก วัตถุดิบ โต๊ะ และยอดขาย

```bash
npm run db:seed
```

### 8. เปิดเว็บไซต์

```bash
npm run dev
```

เปิดเว็บไซต์ที่:

```text
http://localhost:3000
```

## Deploy บน Vercel

1. Import repository `songponp719-cmyk/ProjectRestaurant` ใน Vercel และเลือก framework เป็น Next.js
2. สร้าง Vercel Blob store แบบ **Public** แล้วเชื่อมกับโปรเจกต์ การเชื่อมต่อจะตั้งค่า `BLOB_STORE_ID` และ OIDC ให้แอปอัตโนมัติ หรือเลือกเพิ่ม `BLOB_READ_WRITE_TOKEN`
3. ตั้งค่า `DATABASE_URL` เป็น MySQL ที่ Vercel เชื่อมต่อได้ และรัน `npx prisma migrate deploy` กับฐานข้อมูลนั้นก่อนใช้งาน
4. ตั้งค่า URL สาธารณะของแอป (`AUTH_PUBLIC_URL`, `QR_PUBLIC_BASE_URL`, `NEXT_PUBLIC_BASE_URL` หรือ `NEXT_PUBLIC_APP_URL`) และค่าบริการอีเมล (`SMTP_*`) ตามการใช้งาน

ห้าม commit ค่า environment หรือ secret ลง Git; ให้เพิ่มใน Vercel Project Settings → Environment Variables เท่านั้น รูปภาพที่อัปโหลดจะใช้ Vercel Blob บน Vercel และยังใช้ MinIO ในเครื่องได้ตามเดิม


## URL ของบริการ

| บริการ | URL |
|---|---|
| Restaurant Management System | http://localhost:3000 |
| phpMyAdmin | http://localhost:8080 |
| MinIO API | http://localhost:9000 |
| MinIO Console | http://localhost:9001 |


## สั่งอาหารผ่าน QR ประจำรอบโต๊ะ
### การทดลองสแกนจากมือถือ
- ให้มือถืออยู่ใน Wi-Fi เดียวกับคอม


## การกำหนดอีเมลของระบบ สำหรับใช้ฟังก์ชันรีเซ็ตรหัสผ่าน เพื่อใช้ส่งข้อความอีเมลไปยังบัญชีต่างๆ เพื่อกดลิ้งรีเซ็ตรหัสผ่าน โดยตั้งค่าใน `.env`
ต้องตั้งค่า smtp จาก gmail ที่เราจะเซ็ตให้เป็น gmail หลักของระบบที่จะทำหน้าที่ส่งลิ้งไปให้กับอีเมลอื่นที่เรากรอกให้ในการ
