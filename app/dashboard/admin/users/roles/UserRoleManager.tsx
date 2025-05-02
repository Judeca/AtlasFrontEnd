"use client";

import { useState, useTransition } from "react";
import { updateUserRole } from "@/lib/Actions/usersActions";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function UserRoleManager({ user }: { user: any }) {
  const [role, setRole] = useState(user.role);
  const [isPending, startTransition] = useTransition();

  const handleRoleChange = (newRole: string) => {
    setRole(newRole);
    startTransition(async () => {
      try {
        await updateUserRole(user.id, newRole);
        toast.success("Role updated successfully", {
          description: `${user.firstName}'s role is now ${newRole.toLowerCase()}`,
          action: {
            label: "Dismiss",
            onClick: () => toast.dismiss(),
          },
        });
      } catch (err) {
        toast.error("Failed to update role", {
          description: err instanceof Error ? err.message : "Please try again",
          action: {
            label: "Retry",
            onClick: () => handleRoleChange(newRole),
          },
        });
        // Revert to previous role on error
        setRole(user.role);
      }
    });
  };

  const getBadgeVariant = () => {
    switch (role) {
      case "ADMIN":
        return "destructive";
      case "TEACHER":
        return "secondary";
      case "STUDENT":
        return "default";
      default:
        return "outline";
    }
  };

  return (
    <div className="flex items-center justify-between p-6 border rounded-lg hover:shadow-sm transition-all">
      <div className="flex items-center space-x-4">
        <Avatar>
          <AvatarFallback>
            {user.firstName.charAt(0) + user.lastName.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="flex items-center space-x-2">
            <p className="font-medium">
              {user.firstName} {user.lastName}
            </p>
            <Badge variant={getBadgeVariant()}>
              {role.charAt(0) + role.slice(1).toLowerCase()}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Select
          value={role}
          onValueChange={handleRoleChange}
          disabled={isPending}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="STUDENT">
              <div className="flex items-center">
                <span>Student</span>
              </div>
            </SelectItem>
            <SelectItem value="TEACHER">
              <div className="flex items-center">
                <span>Teacher</span>
              </div>
            </SelectItem>
            <SelectItem value="ADMIN">
              <div className="flex items-center">
                <span>Admin</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>

        {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
      </div>
    </div>
  );
}