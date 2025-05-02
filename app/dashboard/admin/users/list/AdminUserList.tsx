"use client";

import { useState,useEffect } from "react";
import { deleteUser } from "@/lib/Actions/usersActions";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { toast } from "sonner";
import { Loader2, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  createdAt: string;
}

interface Props {
  users: User[];
}

export default function AdminUserList({ users }: Props) {
  const [userList, setUserList] = useState(users);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  useEffect(() => {
    setUserList(users);
  }, [users]);

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setShowDeleteDialog(true);
  };

 
  
  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    
    setDeletingId(userToDelete.id);
    try {
      const result = await deleteUser(userToDelete.id);
      if (result.success) {
        setUserList(prev => prev.filter(user => user.id !== userToDelete.id));
        toast.success("User deleted successfully", {
          description: `${userToDelete.firstName} ${userToDelete.lastName} has been removed.`
        });
      } else {
        toast.error("Failed to delete user", {
          description: result.message
        });
      }
    } catch (error) {
      toast.error("An error occurred", {
        description: error instanceof Error ? error.message : "Please try again"
      });
    } finally {
      setDeletingId(null);
      setUserToDelete(null);
      setShowDeleteDialog(false);
    }
  };

  return (
    <div className="rounded-lg border shadow-sm overflow-hidden">
      <h2 className="text-xl font-semibold p-4 bg-gray-50">User Management</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {userList?.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">
                {user.firstName} {user.lastName}
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell className="capitalize">{user.role.toLowerCase()}</TableCell>
              <TableCell>
                {new Date(user.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteClick(user)}
                  disabled={deletingId === user.id}
                >
                  {deletingId === user.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                  <span className="sr-only">Delete</span>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete{" "}
              <span className="font-semibold">
                {userToDelete?.firstName} {userToDelete?.lastName}
              </span>'s account and remove all their data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={!!deletingId}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              disabled={!!deletingId}
              className="bg-destructive hover:bg-destructive/90"
            >
              {deletingId ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Delete User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}


