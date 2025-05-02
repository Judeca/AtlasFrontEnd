import CreateUserForm from "./CreateUserForm";

export default function CreateUserPage() {
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Create New User</h1>
      <CreateUserForm />
    </div>
  );
}