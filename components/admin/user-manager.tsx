"use client";

import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Shield, Edit, Trash2 } from "lucide-react";
import HeroTable from "./hero-table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import toast from "react-hot-toast";
import { useDebounce } from "@/hooks/use-debounce";
import { User } from "@prisma/client";
import { UserForm } from "./user/user-form";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ListFilter } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type UserWithPosts = User & {
  _count: {
    posts: number;
  };
};

// Utility function to get nested property
const getNestedProperty = (obj: any, path: string) => {
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
};

const ITEMS_PER_PAGE_CLIENT_SIDE = 10; // Define how many items to show per page client-side

export function UserManager() {
  const [allUsers, setAllUsers] = useState<UserWithPosts[]>([]); // Stores all users fetched from server
  const [filteredAndSortedUsers, setFilteredAndSortedUsers] = useState<
    UserWithPosts[]
  >([]); // Users currently displayed in the table
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserWithPosts | null>(null);
  const [userToDelete, setUserToDelete] = useState<UserWithPosts | null>(null);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [sort, setSort] = useState<{
    column: string;
    direction: "asc" | "desc";
  } | null>({ column: "createdAt", direction: "desc" });
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>("ALL"); // New state for role filter

  const debouncedSearch = useDebounce(search, 500);

  // Fetch all users initially from the server
  const fetchAllUsers = useCallback(async () => {
    setLoading(true);
    try {
      // Request all users from the API, or a very large number if "all" is too much
      // The API should still return total count for proper pagination calculation
      const response = await fetch(`/api/users?all=true`); // Assuming API can handle an 'all' parameter
      const data = await response.json();
      setAllUsers(data.users);
      // totalPages will be calculated client-side based on filteredAndSortedUsers length
    } catch (error) {
      console.error("Failed to fetch all users:", error);
      toast.error("Failed to fetch all users.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllUsers();
  }, [fetchAllUsers]);

  // Client-side filtering, sorting, and pagination
  useEffect(() => {
    let processedUsers = [...allUsers];

    // 1. Apply client-side search
    if (debouncedSearch) {
      processedUsers = processedUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          user.email.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    }

    // 2. Apply role filter
    if (selectedRoleFilter !== "ALL") {
      processedUsers = processedUsers.filter(
        (user) => user.role === selectedRoleFilter
      );
    }

    // 3. Apply client-side sort
    if (sort) {
      processedUsers.sort((a, b) => {
        const aValue = getNestedProperty(a, sort.column);
        const bValue = getNestedProperty(b, sort.column);

        if (typeof aValue === "string" && typeof bValue === "string") {
          return sort.direction === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
        if (typeof aValue === "number" && typeof bValue === "number") {
          return sort.direction === "asc" ? aValue - bValue : bValue - aValue;
        }
        // Fallback for other types or if values are null/undefined
        return 0;
      });
    }

    // 4. Apply client-side pagination
    const startIndex = (page - 1) * ITEMS_PER_PAGE_CLIENT_SIDE;
    const endIndex = startIndex + ITEMS_PER_PAGE_CLIENT_SIDE;
    setFilteredAndSortedUsers(processedUsers.slice(startIndex, endIndex));
    setTotalPages(
      Math.ceil(processedUsers.length / ITEMS_PER_PAGE_CLIENT_SIDE)
    );
  }, [allUsers, debouncedSearch, selectedRoleFilter, page, sort]); // Dependencies for client-side processing

  const handleFormSubmit = async (
    userData: Omit<User, "id" | "createdAt" | "updatedAt" | "emailVerified">
  ) => {
    const toastId = toast.loading(
      selectedUser ? "Updating user..." : "Creating user..."
    );
    try {
      const response = await fetch(
        selectedUser ? `/api/users/${selectedUser.id}` : "/api/users",
        {
          method: selectedUser ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData),
        }
      );

      if (response.ok) {
        fetchAllUsers(); // Re-fetch all users to update client-side store
        setIsDialogOpen(false);
        setSelectedUser(null);
        toast.success(
          selectedUser
            ? "User updated successfully."
            : "User created successfully.",
          { id: toastId }
        );
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to save user.", { id: toastId });
      }
    } catch (error) {
      console.error("Failed to save user:", error);
      toast.error("Failed to save user.", { id: toastId });
    }
  };

  const handleEdit = (user: UserWithPosts) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  };

  const handleDelete = (user: UserWithPosts) => {
    setUserToDelete(user);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (userToDelete) {
      const toastId = toast.loading("Deleting user...");
      try {
        const response = await fetch(`/api/users/${userToDelete.id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          fetchAllUsers(); // Re-fetch all users to update client-side store
          toast.success("User deleted successfully.", { id: toastId });
        } else {
          const errorData = await response.json();
          toast.error(errorData.error || "Failed to delete user.", {
            id: toastId,
          });
        }
      } catch (error) {
        console.error("Failed to delete user:", error);
        toast.error("Failed to delete user.", { id: toastId });
      } finally {
        setIsConfirmOpen(false);
        setUserToDelete(null);
      }
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "destructive";
      case "AUTHOR":
        return "secondary";
      case "USER":
        return "outline";
      default:
        return "default";
    }
  };

  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Email", accessor: "email" },
    {
      header: "Role",
      accessor: "role",
      cell: (item: UserWithPosts) => (
        <Badge variant={getRoleBadgeVariant(item.role)}>{item.role}</Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Blog Authors</h2>
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-2">
                <ListFilter className="w-4 h-4 mr-2" />
                Role: {selectedRoleFilter === "ALL" ? "All Roles" : selectedRoleFilter}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSelectedRoleFilter("ALL")}>
                All Roles
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedRoleFilter("ADMIN")}>
                Admin
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedRoleFilter("AUTHOR")}>
                Author
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedRoleFilter("USER")}>
                User
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <HeroTable
        columns={columns}
        data={filteredAndSortedUsers} // Use client-side processed data
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        title="User Management"
        createButtonText=""
        createButtonAction={() => {}}
        search={search}
        setSearch={setSearch}
        page={page}
        setPage={setPage}
        totalPages={totalPages}
        sort={sort}
        setSort={setSort}
      />

      <ConfirmationDialog
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        onConfirm={confirmDelete}
        title="Are you sure?"
        description="This action cannot be undone. This will permanently delete the user."
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedUser ? "Edit User" : "Add New User"}</DialogTitle>
          </DialogHeader>
          <UserForm
            onSubmit={handleFormSubmit}
            initialData={selectedUser ? { name: selectedUser.name, email: selectedUser.email, role: selectedUser.role } : null}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}