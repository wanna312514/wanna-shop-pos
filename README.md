# 🏪 ร้านชำ POS System — Firebase Realtime Database

ระบบ POS สำหรับร้านชำ พร้อม **Firebase Realtime Database** สำหรับ sync ข้อมูลแบบ real-time ระหว่างหลายเครื่อง

---

## 📁 โครงสร้างไฟล์

```
pos-firebase/
├── public/
│   └── index.html          ← ไฟล์ POS หลัก (Firebase sync ฝังอยู่ข้างใน)
├── src/
│   └── firebase.js         ← Firebase module (ใช้อ้างอิง / ขยายต่อ)
├── firebase.json            ← Firebase Hosting config
├── database.rules.json      ← Firebase Database security rules
├── .firebaserc              ← Firebase project ID
├── vercel.json              ← Vercel deployment config
├── package.json
├── .gitignore
└── README.md
```

---

## 🚀 ขั้นตอนการ Setup

### 1. สร้าง Firebase Project

1. ไปที่ [Firebase Console](https://console.firebase.google.com/)
2. คลิก **Add Project** → ตั้งชื่อ เช่น `pos-shop`
3. ปิด Google Analytics (ไม่จำเป็น) → คลิก **Create Project**

### 2. เปิด Realtime Database

1. ในเมนูซ้าย → **Build** → **Realtime Database**
2. คลิก **Create Database**
3. เลือก Region: **asia-southeast1 (Singapore)**
4. เลือก **Start in test mode** (แก้ rules ทีหลัง)

### 3. ดึง Firebase Config

1. Project Settings (⚙️) → **General** → **Your apps**
2. คลิก **</> Web** → ตั้งชื่อ app → **Register app**
3. Copy `firebaseConfig` object

### 4. แก้ไข `firebaseConfig` ใน `public/index.html`

ค้นหา `FIREBASE_CONFIG` (บรรทัดใกล้ท้ายไฟล์) และแก้ค่า:

```javascript
const FIREBASE_CONFIG = {
  apiKey:            "AIza...",
  authDomain:        "pos-shop.firebaseapp.com",
  databaseURL:       "https://pos-shop-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId:         "pos-shop",
  storageBucket:     "pos-shop.appspot.com",
  messagingSenderId: "123456789",
  appId:             "1:123...",
};
```

### 5. แก้ `.firebaserc`

```json
{
  "projects": {
    "default": "pos-shop"
  }
}
```

---

## 📤 Deploy บน GitHub + Vercel

### GitHub

```bash
git init
git add .
git commit -m "feat: POS system with Firebase Realtime DB"
git remote add origin https://github.com/YOUR_USERNAME/pos-firebase.git
git branch -M main
git push -u origin main
```

### Vercel (แนะนำ — ง่ายและฟรี)

1. ไปที่ [vercel.com](https://vercel.com) → **Import Project from GitHub**
2. เลือก repo `pos-firebase`
3. Framework Preset: **Other**
4. Root Directory: ปล่อยว่าง (default)
5. คลิก **Deploy** → รอ 1-2 นาที

> Vercel จะอ่าน `vercel.json` และ serve จาก `public/` อัตโนมัติ

### Firebase Hosting (ทางเลือก)

```bash
npm install -g firebase-tools
firebase login
firebase deploy
```

---

## 📤 Deploy บน Firebase Hosting

```bash
# ติดตั้ง Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Deploy
firebase deploy
```

URL จะได้เป็น: `https://YOUR_PROJECT_ID.web.app`

---

## 🔄 วิธีทำงานของ Firebase Sync

| ข้อมูล | Firebase Path | Trigger |
|--------|--------------|---------|
| สินค้า | `/prods/{bc}` | saveProd, adjStockUnit, confirmRestock |
| หมวดหมู่ | `/cats/{id}` | saveCat, deleteCat |
| การขาย | `/sales/{id}` | confirmPay, deleteSale, saveEditSale |
| รายจ่าย | `/expenses/{id}` | saveExpense, deleteExpense |
| พนักงาน | `/staffList/{id}` | saveStaff, deleteStaff |
| บันทึกเวลา | `/timeLogs/{id}` | checkIn, checkOut |
| วิธีชำระ | `/payMethods/{id}` | savePayMethod |
| ตั้งค่า | `/settings` | saveOwnerPin, addGlobalUnit |
| เงินกะ | `/cashDrawer` | confirmCashDrawer |
| สต๊อกล็อก | `/stockLog` | adjStockUnit, confirmRestock |

### Real-time Sync
- ทุกเครื่องที่เปิด URL เดียวกันจะได้รับข้อมูลอัพเดตแบบ real-time
- เมื่อร้านย่อยลงในเครื่องแคชเชียร์ → สต๊อกในทุกเครื่องอัพเดตทันที

### Initial Seed
- ครั้งแรกที่เปิด: ระบบจะอัพโหลดข้อมูล demo เข้า Firebase อัตโนมัติ

---

## 🔒 Security Rules (สำหรับ Production)

แก้ `database.rules.json` เป็น:

```json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}
```

แล้วเปิด **Firebase Authentication** → **Email/Password** หรือ **Anonymous**

---

## 🛠️ ทดสอบ Local

```bash
npm install
npm run dev
# เปิด http://localhost:3000
```

---

## ❓ คำถามที่พบบ่อย

**Q: ใช้ฟรีได้ไหม?**  
A: Firebase Spark Plan (ฟรี): Realtime DB 1GB storage, 10GB/เดือน bandwidth — เพียงพอสำหรับร้านชำ

**Q: หลายสาขาได้ไหม?**  
A: ได้ — ทุกสาขาเปิด URL เดียวกัน ข้อมูล sync อัตโนมัติ

**Q: ถ้า internet หลุดจะเกิดอะไร?**  
A: Firebase SDK มี offline cache ในตัว ข้อมูลจะ sync เมื่อกลับมา online

**Q: ข้อมูลอยู่ที่ไหน?**  
A: Firebase Realtime Database (Google Cloud) — Singapore region
