// ================================================
// File: /pages/employeeTable.tsx
// ================================================
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/components/AuthContext';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Search, SortAsc, SortDesc, Download, Plus, Edit, Trash2 } from 'lucide-react';

interface EmployeeSummary {
  employee_id: number;
  name: string;
  email: string;
  job_title: string;
  monthly_salary: number;
  url: string;
}

export default function EmployeeTable() {
  const { user } = useAuth();
  const [employees, setEmployees] = useState<EmployeeSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof EmployeeSummary, direction: 'ascending' | 'descending' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

  const sortedEmployees = React.useMemo(() => {
    let sortableItems = [...employees];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [employees, sortConfig]);

  const filteredEmployees = sortedEmployees.filter(emp =>
    Object.values(emp).some(value =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

  const requestSort = (key: keyof EmployeeSummary) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleDownload = () => {
    const worksheet = XLSX.utils.json_to_sheet(employees);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'EmployeeData');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, 'employee_data.xlsx');
  };

  // CRUD functions (placeholders for admin)
  const handleAdd = () => alert('Add new employee');
  const handleEdit = (id: number) => alert(`Edit employee with ID: ${id}`);
  const handleDelete = (id: number) => alert(`Delete employee with ID: ${id}`);

  if (loading) return <Layout title="Employee Table"><div>Loading...</div></Layout>;
  if (error) return <Layout title="Employee Table"><div>Error: {error}</div></Layout>;

  return (
    <Layout title="Employee Table">
      <div className="container mx-auto p-4 bg-card rounded-lg shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 space-y-2 md:space-y-0">
          <div className="flex items-center space-x-2">
            <Search className="h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search all columns..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 rounded-md bg-input border border-border focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleDownload}
              className="flex items-center space-x-2 px-4 py-2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 transition"
            >
              <Download className="w-4 h-4" />
              <span>Download XLSX</span>
            </button>
            {user?.access === 'admin' && (
              <button
                onClick={handleAdd}
                className="flex items-center space-x-2 px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/80 transition"
              >
                <Plus className="w-4 h-4" />
                <span>Add Employee</span>
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto rounded-md border border-border">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted">
              <tr>
                {['employee_id', 'name', 'email', 'job_title', 'monthly_salary'].map(key => (
                  <th
                    key={key}
                    onClick={() => requestSort(key as keyof EmployeeSummary)}
                    className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer"
                  >
                    <div className="flex items-center">
                      <span>{key.replace('_', ' ').toUpperCase()}</span>
                      {sortConfig?.key === key && (
                        sortConfig.direction === 'ascending'
                          ? <SortAsc className="ml-2 h-4 w-4" />
                          : <SortDesc className="ml-2 h-4 w-4" />
                      )}
                    </div>
                  </th>
                ))}
                {user?.access === 'admin' && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border">
              {paginatedEmployees.map((emp) => (
                <tr key={emp.employee_id} className="hover:bg-accent transition">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{emp.employee_id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{emp.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{emp.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{emp.job_title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{emp.monthly_salary}</td>
                  {user?.access === 'admin' && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button onClick={() => handleEdit(emp.employee_id)} className="text-primary hover:text-primary/80 transition">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(emp.employee_id)} className="text-destructive hover:text-destructive/80 transition">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center mt-4">
          <p className="text-sm text-muted-foreground">
            Showing {paginatedEmployees.length} of {filteredEmployees.length} results
          </p>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 disabled:opacity-50 transition"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 disabled:opacity-50 transition"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
