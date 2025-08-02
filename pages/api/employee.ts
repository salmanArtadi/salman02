// ================================================
// File: /pages/api/employees.ts
// ================================================
import type { NextApiRequest, NextApiResponse } from 'next';
import { query } from '@/lib/db';
import { RowDataPacket } from 'mysql2';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const sql = `
        SELECT
          e.employee_id,
          e.name,
          e.email,
          jt.job_title,
          s.monthly_salary,
          p.url
        FROM employee e
        JOIN jobtitle jt ON e.job_id = jt.job_id
        JOIN salary s ON e.employee_id = s.employee_id
        JOIN picture p ON e.employee_id = p.employee_id
        ORDER BY e.employee_id ASC
      `;
      const employees = await query(sql) as RowDataPacket[];
      res.status(200).json(employees);
    } catch (error) {
      console.error('Error fetching employees:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
