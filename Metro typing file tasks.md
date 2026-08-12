# Metro Typing Thailand — สิ่งที่ต้องทำในแต่ละไฟล์

> ใช้คู่กับ `metro-typing-filepath-structure.md` — ไฟล์นี้ลงรายละเอียดว่าแต่ละไฟล์ต้อง**ทำอะไรบ้าง** ก่อนถือว่าเสร็จ

---

## Root

### `README.md`
- [ ] อธิบายว่าโปรเจกต์คืออะไร (1-2 ย่อหน้า)
- [ ] Screenshot หรือ GIF ตัวอย่างการเล่น
- [ ] วิธีติดตั้งและรัน (`frontend/` และ `backend/`)
- [ ] ลิงก์ไปยัง `docs/` ทั้งหมด
- [ ] Tech stack ที่ใช้ (สั้น ๆ)
- [ ] License (ถ้ามี)

### `.gitignore`
- [ ] เพิ่ม `frontend/node_modules/`, `frontend/dist/`
- [ ] เพิ่ม `backend/functions/node_modules/`, `backend/functions/lib/`
- [ ] เพิ่ม `.env`, `.env.local` ทุกระดับ
- [ ] เพิ่ม `.firebase/` (cache ของ Firebase CLI)

### `.firebaserc`
- [ ] ระบุ `projectId` ของ Firebase (แยก alias `default` กับ `production` ถ้ามี 2 environment)

---

## `docs/`

### `metro-typing-blueline-roadmap.md`
- [x] เขียนเสร็จแล้ว — อัปเดตทุกครั้งที่แผนเปลี่ยน

### `metro-typing-team-roles.md`
- [x] เขียนเสร็จแล้ว — ปรับ role ให้ตรงกับจำนวนคนจริงในทีม

### `metro-typing-filepath-structure.md`
- [x] เขียนเสร็จแล้ว

### `architecture-diagrams/`
- [ ] Export diagram จาก mermaid เป็น `.png`/`.svg` (เผื่อใช้ในที่ที่ render mermaid ไม่ได้ เช่น slide นำเสนอ)

---

## `data/`

### `blueline-stations.json`
- [ ] รวบรวมพิกัด `{ code, th, en, lat, lng }` ให้ครบ **38 สถานี**
- [ ] ตรวจสอบลำดับสถานีให้ตรงเส้นทางจริง (ไม่ใช่แค่เรียงตามรหัส BL01-BL38 เพราะเป็น loop line)
- [ ] Validate ด้วยสคริปต์เล็ก ๆ ว่าไม่มีพิกัดซ้ำ/ผิดช่วง (lat ~13.6-13.9, lng ~100.3-100.6 สำหรับกรุงเทพฯ)

### `purpleline-stations.json`
- [ ] ทำหลังสายสีน้ำเงินเสร็จสมบูรณ์ — โครงสร้างเดียวกัน

### `schema.md`
- [ ] อธิบายทุก field ใน station JSON ว่าคืออะไร หน่วยอะไร
- [ ] ตัวอย่างสถานี 1 รายการ พร้อมคอมเมนต์

---

## `frontend/`

### `index.html`
- [ ] เชื่อม `<div id="map">` และ container ของเกม
- [ ] โหลด Leaflet CSS/JS จาก CDN หรือ npm package
- [ ] ลบ `<script src="dist/game.js">` แบบเดิม เปลี่ยนเป็น Vite entry (`<script type="module" src="/src/main.ts">`)

### `package.json`
- [ ] เพิ่ม dependency: `leaflet`, `firebase`, `vite`
- [ ] เพิ่ม script: `dev`, `build`, `preview`

### `tsconfig.json`
- [ ] ย้ายมาจากโปรเจกต์เดิม ปรับ `rootDir`/`outDir` ให้เข้ากับ Vite (ปกติ Vite ไม่ต้องพึ่ง `tsc` build โดยตรง ใช้แค่ type-check)

### `vite.config.ts`
- [ ] ตั้งค่า base path (ถ้า deploy ไม่ใช่ root domain)
- [ ] ตั้งค่า env prefix ให้ Vite อ่าน `.env` (`VITE_` prefix)

### `.env.example`
- [ ] ใส่ชื่อ key ทั้งหมดที่ต้องใช้ (`VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_PROJECT_ID` ฯลฯ) **ไม่ใส่ค่าจริง**

### `src/main.ts`
- [ ] Initialize Firebase app (`firebaseConfig.ts`)
- [ ] Initialize `MetroTypingGame`
- [ ] Initialize `mapController`
- [ ] ผูก event: login button, submit run, load leaderboard

### `src/game/MetroTypingGame.ts`
- [ ] ย้ายโค้ด class เดิมจากโปรเจกต์ TS มาแทบทั้งหมด
- [ ] เพิ่ม hook/callback ตอนเปลี่ยนสถานี เพื่อให้ `mapController` รู้ว่าต้องขยับหมุด
- [ ] เพิ่ม callback ตอนจบเกม เพื่อส่งผลไปที่ `leaderboardApi.ts`

### `src/game/types.ts`
- [ ] ย้าย `interface Station`, `GameState`, `LangKey`, `ModeKey` มาจากเดิม
- [ ] เพิ่ม `interface RunResult` (ผลที่จะส่งไป backend)

### `src/game/stats.ts`
- [ ] แยกฟังก์ชันคำนวณ cpm/accuracy/combo ออกมาจาก class เดิม (ให้ test ง่ายขึ้น)

### `src/map/mapController.ts`
- [ ] Initialize Leaflet map + tile layer (light/skeleton style)
- [ ] ฟังก์ชัน `drawRoute(stations)` วาด polyline
- [ ] ฟังก์ชัน `placeStationMarkers(stations)` ปักหมุดทุกสถานี
- [ ] ฟังก์ชัน `moveTrainTo(station)` เรียกใช้จาก `trainMarker.ts`

### `src/map/trainMarker.ts`
- [ ] สร้าง custom marker icon รูปรถไฟ
- [ ] Animation เคลื่อนที่ระหว่างสถานี (interpolate lat/lng ทีละ frame)

### `src/auth/firebaseAuth.ts`
- [ ] ฟังก์ชัน `loginWithGoogle()` เรียก `signInWithPopup`
- [ ] ฟังก์ชัน `logout()`
- [ ] ฟังก์ชัน `onAuthChange(callback)` ฟัง state login เปลี่ยน
- [ ] จัดการ error (popup ถูกบล็อก, ผู้ใช้ปิด popup เอง)

### `src/leaderboard/leaderboardApi.ts`
- [ ] ฟังก์ชัน `submitRun(result)` เรียก Cloud Function `submitRun` (**ไม่เขียน Firestore ตรง**)
- [ ] ฟังก์ชัน `fetchTopRuns(line, mode)` query อ่านจาก Firestore (อ่านอย่างเดียวอนุญาตได้)

### `src/leaderboard/leaderboardUI.ts`
- [ ] Render ตารางอันดับ 10 อันดับแรก
- [ ] Highlight แถวของผู้เล่นปัจจุบัน (ถ้าติดอันดับ)
- [ ] State: loading / error / ว่างเปล่า (ยังไม่มีใครเล่น)

### `src/firebaseConfig.ts`
- [ ] `initializeApp()` โดยอ่านค่าจาก `import.meta.env.VITE_FIREBASE_*`
- [ ] Export `auth`, `db`, `functions` instance ให้ไฟล์อื่น import ไปใช้

### `src/styles/main.css`
- [ ] ย้าย CSS เดิมจากเกม
- [ ] เพิ่ม style ของ leaderboard, login button, map container

### `public/`
- [ ] favicon, og-image (ถ้าจะแชร์ลิงก์ให้สวย)

---

## `backend/functions/`

### `package.json`
- [ ] เพิ่ม dependency: `firebase-functions`, `firebase-admin`
- [ ] ตั้ง Node version ให้ตรงกับที่ Firebase Functions รองรับ

### `tsconfig.json`
- [ ] ตั้งค่า compile เป็น CommonJS (Cloud Functions ยังต้องการ CommonJS เป็นหลัก)

### `src/index.ts`
- [ ] `export { submitRun } from './submitRun'`
- [ ] `export { getLeaderboard } from './getLeaderboard'` (ถ้าใช้)

### `src/submitRun.ts`
- [ ] รับข้อมูลดิบจาก FE (`cpm`, `accuracy`, `time`, `route`, `userId` จาก auth token — **ไม่เชื่อ userId ที่ FE ส่งมาตรง ๆ ต้องอ่านจาก `context.auth.uid`**)
- [ ] เรียก `validation/antiCheat.ts` ตรวจสอบก่อน
- [ ] ถ้าผ่าน → เขียนลง Firestore collection `runs`
- [ ] ถ้าไม่ผ่าน → return error พร้อมเหตุผล (ไม่ต้องบอกละเอียดเกินไปว่าเช็คอะไรบ้าง กันคนหาทางเลี่ยง)

### `src/getLeaderboard.ts`
- [ ] Query top 10 ตาม `line` + `mode` (ถ้าไม่ทำ อาจให้ FE query ตรงจาก Firestore แทนก็ได้ เพราะเป็นการอ่าน)

### `src/validation/antiCheat.ts`
- [ ] เช็ค `cpm` ไม่เกินค่าสูงสุดที่เป็นไปได้จริง (เช่น > 1500 = ปฏิเสธ)
- [ ] เช็ค `time` สัมพันธ์กับจำนวนสถานีในเส้นทางอย่างสมเหตุสมผล (พิมพ์เร็วเกินจริงไม่ได้)
- [ ] เช็ค `accuracy` อยู่ในช่วง 0-100

### `src/types.ts`
- [ ] `interface RunResult` (ควรตรงกับฝั่ง FE — พิจารณาทำ shared package ทีหลังถ้าโปรเจกต์โตขึ้น)

### `.env.example`
- [ ] ระบุ env ที่ Cloud Function ต้องใช้ (ถ้ามี เช่น ค่า threshold ของ anti-cheat)

### `firestore.rules`
- [ ] `allow read: if true;` สำหรับ collection `runs`
- [ ] `allow write: if false;` (บังคับให้เขียนผ่าน Cloud Function เท่านั้น ซึ่งใช้ Admin SDK ข้าม rules ได้อยู่แล้ว)

### `firestore.indexes.json`
- [ ] สร้าง composite index: `line` (ASC) + `mode` (ASC) + `cpm` (DESC) สำหรับ query leaderboard แบบกรอง+เรียง

### `firebase.json`
- [ ] ตั้งค่า `hosting.public` ชี้ไปที่ `frontend/dist`
- [ ] ตั้งค่า `functions.source` ชี้ไปที่ `backend/functions`
- [ ] ตั้งค่า `firestore.rules` ชี้ไปที่ `backend/firestore.rules`

---

## `.github/workflows/`

### `deploy.yml`
- [ ] Job 1: `npm install && npm run build` ใน `frontend/`
- [ ] Job 2: deploy Cloud Functions (`firebase deploy --only functions`)
- [ ] Job 3: deploy Hosting (`firebase deploy --only hosting`)
- [ ] ตั้ง trigger เฉพาะ push เข้า `main` เท่านั้น
- [ ] เก็บ Firebase token เป็น GitHub Secret (ห้าม hardcode ในไฟล์ workflow)

---

## ลำดับที่แนะนำให้ทำก่อน-หลัง

1. `data/blueline-stations.json` (ไม่มีอันนี้ ทำอย่างอื่นไม่ได้เลย)
2. `frontend/src/map/mapController.ts` (เห็นแผนที่ก่อน ยังไม่ต้องมีเกม)
3. `frontend/src/game/*` (ย้ายเกมเดิมมา + ผูกกับแผนที่)
4. `frontend/src/auth/firebaseAuth.ts` (login ให้ได้ก่อน)
5. `backend/functions/*` + `firestore.rules` (ทำพร้อมกัน เพราะเกี่ยวโยงกัน)
6. `frontend/src/leaderboard/*` (ต่อกับ backend ที่เสร็จแล้ว)
7. `.github/workflows/deploy.yml` (ทำท้ายสุด ตอนทุกอย่างรันได้ local แล้ว)
