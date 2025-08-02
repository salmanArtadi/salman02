// ================================================
// File: /pages/manageUser.tsx
// ================================================
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/components/AuthContext';
import { Plus, Edit, Trash2 } from 'lucide-react';

interface User {
  employee_id: number;
  password: string;
  access: 'admin' | 'regular';
}

export default function ManageUser() {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        setError('Failed to fetch user data.');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.access === 'admin') {
      fetchUsers();
    }
  }, [user]);

  // CRUD functions (placeholders for admin)
  const handleAdd = () => alert('Add new user');
  const handleEdit = (id: number) => alert(`Edit user with ID: ${id}`);
  const handleDelete = (id: number) => alert(`Delete user with ID: ${id}`);

  if (user?.access !== 'admin') {
    return <Layout title="Manage Users"><div>Access Denied</div></Layout>;
  }

  if (loading) return <Layout title="Manage Users"><div>Loading...</div></Layout>;
  if (error) return <Layout title="Manage Users"><div>Error: {error}</div></Layout>;

  return (
    <Layout title="Manage Users">
      <div className="container mx-auto p-4 bg-card rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Manage Users</h2>
          <button
            onClick={handleAdd}
            className="flex items-center space-x-2 px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/80 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add User</span>
          </button>
        </div>

        <div className="overflow-x-auto rounded-md border border-border">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Employee ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Access Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border">
              {users.map((u) => (
                <tr key={u.employee_id} className="hover:bg-accent transition">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{u.employee_id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{u.access}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button onClick={() => handleEdit(u.employee_id)} className="text-primary hover:text-primary/80 transition">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(u.employee_id)} className="text-destructive hover:text-destructive/80 transition">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
