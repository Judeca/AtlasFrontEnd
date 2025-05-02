'use client';

import { useState } from 'react';
import AdminUserList from './AdminUserList';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export default function UserManagement({ initialData }:any) {
  const [data, setData] = useState(initialData);
  const [filters, setFilters] = useState({
    startsWith: '',
    contains: '',
    role: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5
  });
  const [isLoading, setIsLoading] = useState(false);

  const fetchUsers = async (page: number) => {
    setIsLoading(true);
    const sentData={ filters, pagination: { ...pagination, page } }
    console.log("page:",page,"data:",sentData)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/shared-getallUser`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',
                    Accept:'application/json'
         },
        body: JSON.stringify(sentData)
      });
  
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch users');
      }
  
      const newData = await res.json();
      setData(newData);
      console.log("newData",newData)
      setPagination(prev => ({ ...prev, page }));
    } catch (error) {
      toast.error("Failed to load users", {
        description: error instanceof Error ? error.message : 'Please try again'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (value: string) => {
    setFilters(prev => ({ ...prev, role: value }));
  };

  const applyFilters = () => {
    fetchUsers(1); // Reset to first page when filters change
  };

  return (
    <div className="space-y-4">
      {/* Filter Controls */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Input
          placeholder="Name starts with..."
          name="startsWith"
          value={filters.startsWith}
          onChange={handleFilterChange}
        />
        <Input
          placeholder="Name contains..."
          name="contains"
          value={filters.contains}
          onChange={handleFilterChange}
        />
        <Select 
        onValueChange={(value) => handleRoleChange(value === "ALL" ? "" : value)}
        value={filters.role || "ALL"}
        >
        <SelectTrigger>
            <SelectValue placeholder="All roles" />
        </SelectTrigger>
        <SelectContent>
            <SelectItem value="ALL">All Roles</SelectItem>
            <SelectItem value="STUDENT">Student</SelectItem>
            <SelectItem value="TEACHER">Teacher</SelectItem>
            <SelectItem value="ADMIN">Admin</SelectItem>
        </SelectContent>
        </Select>
        <Button onClick={applyFilters} disabled={isLoading}>
          Apply Filters
        </Button>
      </div>

      {/* User List */}
      <AdminUserList users={data.data} />

      {/* Pagination Controls */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Page {data?.meta?.currentPage} of {data?.meta?.totalPages}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => fetchUsers(data?.meta?.currentPage - 1)}
            disabled={data?.meta?.currentPage <= 1 || isLoading}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={() => fetchUsers(data?.meta?.currentPage + 1)}
            disabled={data?.meta?.currentPage >= data?.meta?.totalPages || isLoading}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}