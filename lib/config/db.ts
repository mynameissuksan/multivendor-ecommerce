import mysql from "mysql2/promise";

declare global {
  var mysqlPool: mysql.Pool | undefined;
}

export const pool =
  global.mysqlPool ??
  mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT) || 3306,
    waitForConnections: true,
    connectionLimit: 50, // 👈 อันนี้สำคัญสุด ช่วยเรื่อง Pool เต็ม
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
    connectTimeout: 20000, // 👈 เพิ่มเวลา connect เป็น 20 วิ
  });
if (process.env.NODE_ENV !== "production") {
  global.mysqlPool = pool;
}
