# Metro Typing Thailand — โครงสร้างไฟล์โปรเจกต์ (Full Structure)

> แยก FE/BE จริงตามที่ตกลงกันไว้ — FE คุยกับ BE ผ่าน Cloud Functions เท่านั้น ไม่เขียน Firestore ตรง

```
Bangkok-Metro-Typing/
│
├── README.md                          ← ภาพรวมโปรเจกต์ + วิธีรัน (root)
│
├── docs/                              ← เอกสารทั้งหมดที่ทำไปแล้ว
│   ├── metro-typing-blueline-roadmap.md
│   ├── metro-typing-team-roles.md
│   └── architecture-diagrams/         ← เก็บรูป export จาก mermaid ถ้าต้องใช้นอก md
│
├── data/                              ← เฟส 0: ข้อมูลสถานี (ใช้ร่วมกันทั้ง FE/BE)
│   ├── blueline-stations.json
│   ├── purpleline-stations.json       ← (ทำทีหลัง)
│   └── schema.md                      ← อธิบายโครงสร้าง JSON
│
├── frontend/                          ← ทุกอย่างที่ FE Dev ดูแล
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── .env.example                   ← ตัวอย่าง Firebase config (ไม่ใส่ค่าจริง)
│   ├── src/
│   │   ├── main.ts                    ← entry point
│   │   ├── game/
│   │   │   ├── MetroTypingGame.ts     ← engine พิมพ์เดิม
│   │   │   ├── types.ts               ← Station, GameState, ฯลฯ
│   │   │   └── stats.ts               ← คำนวณ cpm/accuracy/combo
│   │   ├── map/
│   │   │   ├── mapController.ts       ← wrap Leaflet
│   │   │   └── trainMarker.ts         ← หมุดรถไฟ + animation
│   │   ├── auth/
│   │   │   └── firebaseAuth.ts        ← signInWithPopup wrapper
│   │   ├── leaderboard/
│   │   │   ├── leaderboardApi.ts      ← เรียก Cloud Function + อ่าน Firestore
│   │   │   └── leaderboardUI.ts
│   │   ├── firebaseConfig.ts          ← initializeApp (อ่านจาก env)
│   │   └── styles/
│   │       └── main.css
│   └── public/                        ← asset สาธารณะ (favicon ฯลฯ)
│
├── backend/                           ← ทุกอย่างที่ BE Dev ดูแล (Firebase Functions)
│   ├── functions/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── src/
│   │   │   ├── index.ts               ← export functions ทั้งหมด
│   │   │   ├── submitRun.ts           ← ตรวจสอบ + เขียนผลวิ่ง
│   │   │   ├── getLeaderboard.ts      ← (ถ้าไม่ query ตรงจาก FE)
│   │   │   ├── validation/
│   │   │   │   └── antiCheat.ts       ← กฎตรวจสอบความสมเหตุสมผล
│   │   │   └── types.ts               ← ใช้ร่วมกับ FE ได้ถ้าตั้ง shared package
│   │   └── .env.example
│   ├── firestore.rules                ← Security Rules
│   ├── firestore.indexes.json         ← index สำหรับ query leaderboard
│   └── firebase.json                  ← config รวม (hosting + functions + firestore)
│
├── .github/
│   └── workflows/
│       └── deploy.yml                 ← CI/CD: build FE → deploy Functions → deploy Hosting
│
├── .gitignore                         ← เพิ่ม frontend/dist, backend/functions/lib
└── .firebaserc                        ← ระบุ Firebase project (dev/production)
```

## เหตุผลของโครงสร้างนี้

| จุด | เหตุผล |
|---|---|
| `frontend/` กับ `backend/` แยกโฟลเดอร์ชัดเจน | คนละ `package.json`, คนละ dependency, deploy แยกกันได้ |
| `data/` อยู่นอกทั้งสอง | ทั้ง FE (โหลดแสดงแผนที่) และ BE (validate เส้นทาง) ใช้ไฟล์เดียวกัน ไม่ต้อง sync สองที่ |
| `docs/` แยกจากโค้ด | เอกสารที่ทำไปแล้วทั้งหมดอยู่รวมที่เดียว หาเจอง่าย |
| `backend/functions/` เป็นโปรเจกต์ npm แยก | Firebase Functions ต้องมี `package.json` ของตัวเอง (deploy แยกจาก FE) |
| `firestore.rules` อยู่ระดับ `backend/` ไม่ใช่ `frontend/` | ย้ำว่าเป็นเรื่องความปลอดภัยข้อมูล ไม่ใช่เรื่อง UI |
| `.github/workflows/` ที่ root | CI/CD คุมทั้ง repo ไม่ใช่แค่ FE หรือ BE อย่างเดียว |

## ขั้นตอนถัดไปที่แนะนำ

ย้ายโปรเจกต์ `metro-typing-ts` ที่มีอยู่แล้วเข้าไปเป็น `frontend/` — โครงสร้าง `src/`, `tsconfig.json` เดิมใช้ได้เกือบทั้งหมด แค่ย้ายตำแหน่งและเพิ่มโฟลเดอร์ `map/`, `auth/`, `leaderboard/` ตามด้านบน
