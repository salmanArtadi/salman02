// ================================================
// File: /pages/_middleware.ts
// ================================================
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import Cookies from 'js-cookie';

const adminRoutes = ['/manageUser'];
const privateRoutes = ['/about', '/joke', '/employeeTable', '/employeeCard', '/manageUser'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get('token')?.value;

  // Handle redirection for authenticated users
  if (pathname === '/login' && token) {
    return NextResponse.redirect(new URL('/about', req.url));
  }

  // Handle protected routes
  if (privateRoutes.includes(pathname)) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    try {
      const decoded = jwt.decode(token) as { employee_id: string; access: 'admin' | 'regular'; exp: number; };
      if (!decoded || decoded.exp * 1000 < Date.now()) {
        return NextResponse.redirect(new URL('/login', req.url));
      }

      // Handle admin-only routes
      if (adminRoutes.includes(pathname) && decoded.access !== 'admin') {
        return NextResponse.redirect(new URL('/about', req.url));
      }

    } catch (error) {
      console.error('JWT decoding error:', error);
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  return NextResponse.next();
}
