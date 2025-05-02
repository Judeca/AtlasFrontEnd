
import { fetchUsers, fetchUsersnofilter } from "@/lib/Actions/usersActions";
import UserRoleManager from "./UserRoleManager";

export default async function UserListPage() {
  const users = await fetchUsersnofilter();

  return (
    <div className="container mx-auto py-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <p className="text-muted-foreground">
          Manage user roles and permissions
        </p>
        
        <div className="space-y-4">
          {users?.map((user:any) => (
            <UserRoleManager key={user.id} user={user} />
          ))}
        </div>
      </div>
    </div>
  );
}
