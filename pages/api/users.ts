// ================================================
// File: /pages/api/users.ts
// ================================================
import type { NextApiRequest, NextApiResponse } from 'next';
import { query } from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import jwt from 'jsonwebtoken';

// Helper function to get user access from cookie
const getUserAccess = (token: string | undefined): 'admin' | 'regular' | null => {
  if (!token) return null;
  try {
    const decoded = jwt.decode(token) as { access: 'admin' | 'regular' };
    return decoded.access;
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.cookies.token;
  const access = getUserAccess(token);

  // Check for admin access
  if (access !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  switch (req.method) {
    case 'GET':
      try {
        const users = await query('SELECT employee_id, access FROM user ORDER BY employee_id ASC') as RowDataPacket[];
        res.status(200).json(users);
      } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Internal Server Error' });
      }
      break;

    case 'POST': // Create User
      try {
        const { employee_id, password, access_type } = req.body;
        const result = await query(
          'INSERT INTO user (employee_id, password, access) VALUES (?, ?, ?)',
          [employee_id, password, access_type]
        );
        res.status(201).json({ message: 'User created', id: (result as any).insertId });
      } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Internal Server Error' });
      }
      break;

    case 'PUT': // Update User
      try {
        const { employee_id, password, access_type } = req.body;
        const result = await query(
          'UPDATE user SET password = ?, access = ? WHERE employee_id = ?',
          [password, access_type, employee_id]
        );
        res.status(200).json({ message: 'User updated' });
      } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Internal Server Error' });
      }
      break;

    case 'DELETE': // Delete User
      try {
        const { employee_id } = req.body;
        const result = await query(
          'DELETE FROM user WHERE employee_id = ?',
          [employee_id]
        );
        res.status(200).json({ message: 'User deleted' });
      } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Internal Server Error' });
      }
      break;

    default:
      res.status(405).json({ message: 'Method Not Allowed' });
      break;
  }
}
