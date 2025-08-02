// ================================================
// File: /pages/api/login.ts
// ================================================
import type { NextApiRequest, NextApiResponse } from 'next';
import { query } from '@/lib/db';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { employeeId, password } = req.body;

  if (!employeeId || !password) {
    return res.status(400).json({ message: 'Employee ID and password are required' });
  }

  try {
    const result = await query(
      'SELECT employee_id, password, access FROM user WHERE employee_id = ? AND password = ?',
      [employeeId, password]
    );

    if (result.length === 0) {
      return res.status(401).json({ message: 'Invalid employee_id or password' });
    }

    const user = result[0] as { employee_id: number; access: 'admin' | 'regular' };

    const payload = {
      employee_id: user.employee_id,
      access: user.access,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '15m' });

    const cookie = serialize('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 15, // 15 minutes
    });

    res.setHeader('Set-Cookie', cookie);
    return res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
