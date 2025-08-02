// ================================================
// File: /lib/db.ts
// ================================================
import mysql, { ConnectionOptions } from 'mysql2/promise';

// This utility function connects to the MySQL database
export async function query(sql: string, params: any[] = []) {
  const options: ConnectionOptions = {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  };

  const connection = await mysql.createConnection(options);

  try {
    const [rows] = await connection.execute(sql, params);
    return rows;
  } finally {
    connection.end();
  }
}
