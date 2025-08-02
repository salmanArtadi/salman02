// ================================================
// File: /components/Layout.tsx
// ================================================
import React, { ReactNode } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from './AuthContext';
import { useTheme } from 'next-themes';
import {
  Home,
  User,
  Laugh,
  Table,
  LayoutGrid,
  Settings,
  Sun,
  Moon,
  LogOut,
} from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  title: string;
}

const navItems = [
  { href: '/about', label: 'About', icon: Home, adminOnly: false },
  { href: '/joke', label: 'Jokes', icon: Laugh, adminOnly: false },
  { href: '/employeeTable', label: 'Employee Table', icon: Table, adminOnly: false },
  { href: '/employeeCard', label: 'Employee Cards', icon: LayoutGrid, adminOnly: false },
  { href: '/manageUser', label: 'Manage Users', icon: Settings, adminOnly: true },
];

const Layout = ({ children, title }: LayoutProps) => {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const filteredNavItems = navItems.filter(item => !item.adminOnly || user?.access === 'admin');

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Head>
        <title>{title} | User Dashboard</title>
      </Head>

      <header className="flex items-center justify-between p-4 bg-card shadow-md">
        <h1 className="text-xl font-bold">Salman02 Dashboard</h1>
        <nav className="flex space-x-4">
          {filteredNavItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-2 p-2 rounded-md transition-colors ${
                router.pathname === item.href
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-accent hover:text-accent-foreground'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-full hover:bg-accent transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 p-2 rounded-md hover:bg-red-500 hover:text-white transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      <main className="flex-grow p-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
