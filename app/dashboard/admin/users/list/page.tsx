import { fetchUsers } from "@/lib/Actions/usersActions";
import UserManagement from "./UserManagement";

export default async function AdminPage() {
    const initialData = await fetchUsers(1); // Fetch first page by default
  
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
        <UserManagement initialData={initialData} />
      </div>
    );
  }