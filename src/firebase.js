// ─────────────────────────────────────────────────────────
// firebase.js  —  Firebase Realtime Database sync layer
// แก้ไข firebaseConfig ด้วยค่าจาก Firebase Console ของคุณ
// ─────────────────────────────────────────────────────────

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
  onValue,
  push,
  update,
  remove,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

// ══════════════════════════════════════════════
//  🔥 แก้ไข firebaseConfig ด้วยค่าของคุณ
// ══════════════════════════════════════════════
const firebaseConfig = {
  apiKey:            "YOUR_API_KEY",
  authDomain:        "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL:       "https://YOUR_PROJECT_ID-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId:         "YOUR_PROJECT_ID",
  storageBucket:     "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId:             "YOUR_APP_ID",
};

const app = initializeApp(firebaseConfig);
const db  = getDatabase(app);

// ══════════════════════════════════════════════
//  Database paths
// ══════════════════════════════════════════════
const PATHS = {
  prods:      "prods",
  cats:       "cats",
  sales:      "sales",
  stockLog:   "stockLog",
  expenses:   "expenses",
  staffList:  "staffList",
  timeLogs:   "timeLogs",
  payMethods: "payMethods",
  settings:   "settings",     // ownerPin, globalUnits, ROLE_PERMS
  cashDrawer: "cashDrawer",
};

// ══════════════════════════════════════════════
//  Generic helpers
// ══════════════════════════════════════════════

/** แปลง array เป็น object {bc: item, ...} โดยใช้ keyField */
function arrayToObj(arr, keyField = "id") {
  const obj = {};
  arr.forEach((item) => {
    const k = item[keyField];
    if (k != null) obj[k] = item;
  });
  return obj;
}

/** แปลง Firebase snapshot object กลับเป็น array */
function objToArray(obj) {
  if (!obj) return [];
  return Object.values(obj);
}

// ══════════════════════════════════════════════
//  WRITE helpers
// ══════════════════════════════════════════════

export function saveProds(prods) {
  return set(ref(db, PATHS.prods), arrayToObj(prods, "bc"));
}

export function saveCats(cats) {
  return set(ref(db, PATHS.cats), arrayToObj(cats, "id"));
}

export function saveSingleProd(prod) {
  return set(ref(db, `${PATHS.prods}/${prod.bc}`), prod);
}

export function deleteProd(bc) {
  return remove(ref(db, `${PATHS.prods}/${bc}`));
}

export function pushSale(sale) {
  // sale.id ใช้เป็น key
  return set(ref(db, `${PATHS.sales}/${sale.id}`), sale);
}

export function updateSale(sale) {
  return set(ref(db, `${PATHS.sales}/${sale.id}`), sale);
}

export function deleteSale(id) {
  return remove(ref(db, `${PATHS.sales}/${id}`));
}

export function pushStockLog(entry) {
  return push(ref(db, PATHS.stockLog), entry);
}

export function pushExpense(expense) {
  return set(ref(db, `${PATHS.expenses}/${expense.id}`), expense);
}

export function updateExpense(expense) {
  return set(ref(db, `${PATHS.expenses}/${expense.id}`), expense);
}

export function deleteExpense(id) {
  return remove(ref(db, `${PATHS.expenses}/${id}`));
}

export function saveStaffList(staffList) {
  return set(ref(db, PATHS.staffList), arrayToObj(staffList, "id"));
}

export function pushTimelog(log) {
  return set(ref(db, `${PATHS.timeLogs}/${log.id}`), log);
}

export function updateTimelog(log) {
  return set(ref(db, `${PATHS.timeLogs}/${log.id}`), log);
}

export function savePayMethods(methods) {
  return set(ref(db, PATHS.payMethods), arrayToObj(methods, "id"));
}

export function saveSettings(settings) {
  return set(ref(db, PATHS.settings), settings);
}

export function saveCashDrawer(drawer) {
  return set(ref(db, PATHS.cashDrawer), drawer);
}

// ══════════════════════════════════════════════
//  LISTEN (realtime)
// ══════════════════════════════════════════════

/**
 * ฟัง path และเรียก callback(data) ทุกครั้งที่มีการเปลี่ยนแปลง
 * callback จะได้รับ array (สำหรับ collection) หรือ object
 */
export function listenPath(path, callback, asArray = true, keyField = "id") {
  return onValue(ref(db, path), (snap) => {
    const val = snap.val();
    callback(asArray ? objToArray(val) : val || {});
  });
}

export function listenProds(callback) {
  return listenPath(PATHS.prods, callback, true, "bc");
}

export function listenCats(callback) {
  return listenPath(PATHS.cats, callback, true, "id");
}

export function listenSales(callback) {
  return listenPath(PATHS.sales, callback, true, "id");
}

export function listenExpenses(callback) {
  return listenPath(PATHS.expenses, callback, true, "id");
}

export function listenStaffList(callback) {
  return listenPath(PATHS.staffList, callback, true, "id");
}

export function listenTimeLogs(callback) {
  return listenPath(PATHS.timeLogs, callback, true, "id");
}

export function listenPayMethods(callback) {
  return listenPath(PATHS.payMethods, callback, true, "id");
}

export function listenSettings(callback) {
  return listenPath(PATHS.settings, callback, false);
}

export function listenCashDrawer(callback) {
  return listenPath(PATHS.cashDrawer, callback, false);
}

export function listenStockLog(callback) {
  return listenPath(PATHS.stockLog, callback, true, "id");
}

// ══════════════════════════════════════════════
//  Export db สำหรับใช้ขั้นสูง (ถ้าต้องการ)
// ══════════════════════════════════════════════
export { db, ref, serverTimestamp };
