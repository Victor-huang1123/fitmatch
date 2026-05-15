import bcrypt from "bcryptjs";
import { db } from "./connection";

const venues = [
  ["v01", "m_demo", "CoreLab 體能工作室", ["體能訓練"], "台北市", "大安區", "台北市大安區復興南路 88 號", "02-2700-1234", "週一至週日 07:00-22:00", ["現場付款", "轉帳"], "小班制重量訓練與功能性體能課。", 4.8, 126, 900, "#127c69"],
  ["v02", "m_demo", "Flow Yoga Space", ["身心控制"], "台北市", "中山區", "台北市中山區南京東路 16 號", "02-2511-7799", "週一至週六 08:00-21:30", ["現場付款", "信用卡"], "專注瑜伽、皮拉提斯與呼吸訓練。", 4.7, 98, 700, "#7c4d12"],
  ["v03", "m02", "Strike Boxing Club", ["競技對抗", "體能訓練"], "新北市", "板橋區", "新北市板橋區文化路 21 號", "02-2255-9090", "週二至週日 10:00-22:00", ["現場付款"], "拳擊技術、沙包課與對抗基礎訓練。", 4.6, 81, 850, "#aa3d2f"],
  ["v04", "m03", "SkillUp 攀岩訓練館", ["技巧", "戶外運動"], "桃園市", "桃園區", "桃園市桃園區中正路 300 號", "03-335-6111", "週一至週日 09:00-22:00", ["現場付款", "轉帳"], "抱石與攀岩技巧課。", 4.9, 64, 650, "#35618f"],
  ["v05", "m04", "Tempo Cycling Room", ["體能訓練"], "台中市", "西屯區", "台中市西屯區市政北七路 55 號", "04-2258-5566", "週一至週五 06:30-21:00，週末 09:00-18:00", ["現場付款", "信用卡"], "飛輪與心肺間歇課程。", 4.5, 73, 550, "#6f5a9c"],
] as const;

const courses = [
  ["c101", "v01", "基礎肌力評估課", 900, "動作檢測、深蹲硬舉基礎與個人訓練建議。"],
  ["c102", "v01", "四人小班重量訓練", 1200, "教練巡迴指導，建立安全重量訓練節奏。"],
  ["c201", "v02", "晨間流動瑜伽", 700, "溫和串聯伸展與呼吸，適合初學者。"],
  ["c202", "v02", "核心皮拉提斯", 950, "墊上核心控制，改善姿勢與軀幹穩定。"],
  ["c301", "v03", "拳擊入門課", 850, "步伐、防守、直拳與基礎組合拳。"],
  ["c302", "v03", "沙包燃脂課", 780, "高強度沙包循環，兼顧技巧與心肺。"],
  ["c401", "v04", "抱石入門", 650, "安全落地、握點使用與簡易路線閱讀。"],
  ["c402", "v04", "進階路線技巧", 1100, "重心轉移、腳法與動態動作練習。"],
  ["c501", "v05", "節奏飛輪 45", 550, "45 分鐘節奏與坡度變化，提升心肺耐力。"],
  ["c502", "v05", "HIIT Cycling", 680, "短衝刺間歇，適合想有效率流汗的學員。"],
] as const;

const coaches = [
  ["t101", "v01", "陳柏宇", 7, "肌力與體態調整"], ["t102", "v01", "王品安", 5, "新手重量訓練"],
  ["t201", "v02", "周雨柔", 8, "瑜伽與呼吸訓練"], ["t202", "v02", "李佳穎", 6, "皮拉提斯"],
  ["t301", "v03", "張凱翔", 9, "拳擊技術"], ["t302", "v03", "許哲維", 4, "體能循環"],
  ["t401", "v04", "吳珮甄", 6, "抱石技巧"], ["t402", "v04", "林威廷", 10, "攀岩安全"],
  ["t501", "v05", "高予晴", 5, "飛輪節奏課"], ["t502", "v05", "黃子翔", 6, "心肺間歇"],
] as const;

export function seed() {
  const userCount = db.prepare("SELECT COUNT(*) as count FROM users").get() as { count: number };
  if (userCount.count > 0) return;

  const passwordHash = bcrypt.hashSync("password123", 10);
  db.prepare("INSERT INTO users (id, name, phone, password_hash, role, merchant_id) VALUES (?, ?, ?, ?, ?, ?)").run("u_demo", "林學員", "0912000000", passwordHash, "student", null);
  db.prepare("INSERT INTO users (id, name, phone, password_hash, role, merchant_id) VALUES (?, ?, ?, ?, ?, ?)").run("m_demo", "商家小管家", "0999000000", passwordHash, "merchant", "m_demo");
  ["m02", "m03", "m04"].forEach((id) => {
    db.prepare("INSERT INTO users (id, name, phone, password_hash, role, merchant_id) VALUES (?, ?, ?, ?, ?, ?)").run(id, `商家 ${id}`, `0988${id.slice(1)}0000`, passwordHash, "merchant", id);
  });

  const insertVenue = db.prepare("INSERT INTO venues VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
  venues.forEach((venue) => insertVenue.run(venue[0], venue[1], venue[2], JSON.stringify(venue[3]), venue[4], venue[5], venue[6], venue[7], venue[8], JSON.stringify(venue[9]), venue[10], venue[11], venue[12], venue[13], venue[14]));

  const insertCourse = db.prepare("INSERT INTO courses VALUES (?, ?, ?, ?, ?)");
  courses.forEach((course) => insertCourse.run(...course));

  const insertCoach = db.prepare("INSERT INTO coaches VALUES (?, ?, ?, ?, ?)");
  coaches.forEach((coach) => insertCoach.run(...coach));

  const insertReview = db.prepare("INSERT INTO reviews (id, venue_id, user_name, rating, comment, created_at) VALUES (?, ?, ?, ?, ?, ?)");
  venues.forEach((venue, index) => {
    insertReview.run(`r${index}a`, venue[0], "匿名學員", venue[11], "教練說明清楚，環境維持得很乾淨。", "2026-04-18");
    insertReview.run(`r${index}b`, venue[0], "會員", Math.max(4.2, Number(venue[11]) - 0.2), "預約流程簡單，課程強度安排合理。", "2026-03-27");
  });
}
