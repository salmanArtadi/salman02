// ================================================
// File: /pages/employeeCard.tsx
// ================================================
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Search } from 'lucide-react';

interface EmployeeSummary {
  employee_id: number;
  name: string;
  email: string;
  job_title: string;
  monthly_salary: number;
  url: string;
}

export default function EmployeeCardPage() {
  const [employees, setEmployees] = useState<EmployeeSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/employees');
      if (response.ok) {
        const data = await response.json();
        setEmployees(data);
      } else {
        setError('Failed to fetch employee data.');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.job_title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <Layout title="Employee Cards"><div>Loading...</div></Layout>;
  if (error) return <Layout title="Employee Cards"><div>Error: {error}</div></Layout>;

  return (
    <Layout title="Employee Cards">
      <div className="container mx-auto p-4">
        <div className="flex justify-center mb-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name or job title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-md bg-input border border-border focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEmployees.length > 0 ? (
            filteredEmployees.map((emp) => (
              <div
                key={emp.employee_id}
                className="bg-card text-card-foreground p-6 rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <img src={emp.url} alt={emp.name} className="w-16 h-16 rounded-full border-2 border-primary" />
                  <div>
                    <h3 className="text-xl font-bold">{emp.name}</h3>
                    <p className="text-sm text-muted-foreground">{emp.job_title}</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="flex justify-between">
                    <span className="font-medium">Email:</span>
                    <span>{emp.email}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="font-medium">Salary:</span>
                    <span>${emp.monthly_salary.toFixed(2)}</span>
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-muted-foreground py-8">
              No employees found matching your search.
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
