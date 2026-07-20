# รางไทย พิมพ์ (Metro Typing Thailand) — TypeScript

เกมฝึกพิมพ์โดยใช้ชื่อสถานี BTS / MRT จริง เล่นคนเดียว ออฟไลน์ ไม่ต้องต่อเน็ต

## โครงสร้างไฟล์
```
metro-typing-ts/
├── index.html        ← เปิดไฟล์นี้เพื่อเล่น (โหลด dist/game.js)
├── src/game.ts        ← ซอร์ส TypeScript ทั้งหมด (แก้ตรงนี้)
├── dist/game.js        ← ไฟล์ที่ compile แล้ว (สร้างจาก src/game.ts)
├── tsconfig.json
└── package.json
```

## วิธีรัน (ครั้งแรก)
ต้องมี [Node.js](https://nodejs.org) ติดตั้งไว้ก่อน

```bash
cd metro-typing-ts
npm install       # ติดตั้ง TypeScript compiler
npm run build      # compile src/game.ts -> dist/game.js
npm run serve       # เปิด localhost:8000
```

แล้วเปิดเบราว์เซอร์ไปที่ **http://localhost:8000**

(หรือถ้าไม่อยากรัน server ก็ดับเบิลคลิกเปิด `index.html` ตรง ๆ ได้เลย เพราะเป็นไฟล์ static ล้วน)

## วิธีแก้ไขแล้วดูผลสด ๆ
```bash
npm run watch    # compile ใหม่อัตโนมัติทุกครั้งที่แก้ src/game.ts
```
แล้ว refresh หน้าเบราว์เซอร์เพื่อดูผล

## แก้ไขข้อมูลสถานี / เพิ่มสาย
แก้ที่ `const LINES` ด้านบนของ `src/game.ts` — เพิ่ม object ใหม่ในรูปแบบเดียวกับสายที่มีอยู่ (เช่น เพิ่มสายสีเหลือง, สีชมพู, สีทอง) แล้วรัน `npm run build` ใหม่
