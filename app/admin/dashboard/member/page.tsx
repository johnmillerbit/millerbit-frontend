"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, MoreHorizontal, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Cookies from "js-cookie";

export type Member = {
  user_id: string;
  first_name: string;
  last_name: string;
  position: string;
  email: string;
  password?: string;
  created_at?: string;
};

interface CreateMemberFormProps {
  onSave: (newMember: Member) => void;
  onCloseDialog: () => void;
}

const CreateMemberForm: React.FC<CreateMemberFormProps> = ({
  onSave,
  onCloseDialog,
}) => {
  const [formData, setFormData] = useState<
    Omit<Member, "user_id" | "created_at">
  >({
    first_name: "",
    last_name: "",
    position: "",
    email: "",
    password: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setIsSaving(true);
    try {
      const token = Cookies.get("token");
      if (!token) {
        setFormError("No authentication token found. Please log in.");
        setIsSaving(false);
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const newMember: Member = await response.json();
      onSave(newMember);
      onCloseDialog();
    } catch (err: unknown) {
      setFormError(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred during member creation."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
      {formError && (
        <Alert
          variant="destructive"
          className="mb-4 bg-red-900/20 border-red-500/30 text-red-200 backdrop-blur-xl"
        >
          <AlertTriangle className="h-4 w-4 text-red-300" />
          <AlertTitle className="text-red-100">Error</AlertTitle>
          <AlertDescription className="text-red-200">
            {formError}
          </AlertDescription>
        </Alert>
      )}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="first_name" className="text-slate-300 text-right">
          First Name
        </Label>
        <Input
          id="first_name"
          value={formData.first_name}
          onChange={handleChange}
          className="col-span-3 bg-white/5 border-white/10 text-white"
          required
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="last_name" className="text-slate-300 text-right">
          Last Name
        </Label>
        <Input
          id="last_name"
          value={formData.last_name}
          onChange={handleChange}
          className="col-span-3 bg-white/5 border-white/10 text-white"
          required
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="position" className="text-slate-300 text-right">
          Position
        </Label>
        <div className="col-span-3">
          <Select
            value={formData.position}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, position: value }))
            }
          >
            <SelectTrigger className="w-full bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="Position" />
            </SelectTrigger>
            <SelectContent className="text-white bg-slate-900 border-white/10">
              <SelectItem value="Team Leader">Team Leader</SelectItem>
              <SelectItem value="Team Member">Team Member</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="email" className="text-slate-300 text-right">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          className="col-span-3 bg-white/5 border-white/10 text-white"
          required
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="password" className="text-slate-300 text-right">
          Password
        </Label>
        <Input
          id="password"
          type="password"
          value={formData.password || ""}
          onChange={handleChange}
          className="col-span-3 bg-white/5 border-white/10 text-white"
        />
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCloseDialog}
          disabled={isSaving}
          className="border-white/10 text-white hover:bg-white/10 bg-transparent"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSaving}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
        >
          {isSaving ? "Creating..." : "Create Member"}
        </Button>
      </div>
    </form>
  );
};

interface EditMemberFormProps {
  member: Member;
  onSave: (updatedMember: Member) => void;
  onCancel: () => void;
  onCloseDialog: () => void;
}

const EditMemberForm: React.FC<EditMemberFormProps> = ({
  member,
  onSave,
  onCancel,
  onCloseDialog,
}) => {
  const [formData, setFormData] = useState<Member>(member);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setIsSaving(true);
    try {
      const token = Cookies.get("token");
      if (!token) {
        setFormError("No authentication token found. Please log in.");
        setIsSaving(false);
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${formData.user_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      onSave(formData);
      onCloseDialog();
    } catch (err: unknown) {
      setFormError(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred during update."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
      {formError && (
        <Alert
          variant="destructive"
          className="mb-4 bg-red-900/20 border-red-500/30 text-red-200 backdrop-blur-xl"
        >
          <AlertTriangle className="h-4 w-4 text-red-300" />
          <AlertTitle className="text-red-100">Error</AlertTitle>
          <AlertDescription className="text-red-200">
            {formError}
          </AlertDescription>
        </Alert>
      )}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="first_name" className="text-slate-300 text-right">
          First Name
        </Label>
        <Input
          id="first_name"
          value={formData.first_name}
          onChange={handleChange}
          className="col-span-3 bg-white/5 border-white/10 text-white"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="last_name" className="text-slate-300 text-right">
          Last Name
        </Label>
        <Input
          id="last_name"
          value={formData.last_name}
          onChange={handleChange}
          className="col-span-3 bg-white/5 border-white/10 text-white"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="email" className="text-slate-300 text-right">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          className="col-span-3 bg-white/5 border-white/10 text-white"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="position" className="text-slate-300 text-right">
          Position
        </Label>
        <Input
          id="position"
          value={formData.position}
          onChange={handleChange}
          className="col-span-3 bg-white/5 border-white/10 text-white"
        />
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            onCancel();
            onCloseDialog();
          }}
          disabled={isSaving}
          className="border-white/10 text-white hover:bg-white/10 bg-transparent"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSaving}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
};

interface ViewMemberDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  member: Member | null;
}

const ViewMemberDialog: React.FC<ViewMemberDialogProps> = ({
  isOpen,
  onOpenChange,
  member,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white/5 border-white/10 text-white sm:max-w-[425px] backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-white">Member Details</DialogTitle>
          <DialogDescription className="text-slate-400">
            Detailed information about the selected member.
          </DialogDescription>
        </DialogHeader>
        {member ? (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <p className="text-slate-300 col-span-1">ID:</p>
              <p className="col-span-3 font-semibold break-all">
                {member.user_id}
              </p>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <p className="text-slate-300 col-span-1">Name:</p>
              <p className="col-span-3 font-semibold">
                {member.first_name} {member.last_name}
              </p>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <p className="text-slate-300 col-span-1">Email:</p>
              <p className="col-span-3">{member.email}</p>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <p className="text-slate-300 col-span-1">Position:</p>
              <p className="col-span-3">{member.position}</p>
            </div>
            {member.created_at && (
              <div className="grid grid-cols-4 items-center gap-4">
                <p className="text-slate-300 col-span-1">Joined:</p>
                <p className="col-span-3">
                  {new Date(member.created_at).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        ) : (
          <p className="text-slate-400">No member selected.</p>
        )}
      </DialogContent>
    </Dialog>
  );
};

interface EditMemberDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  member: Member | null;
  onSave: (updatedMember: Member) => void;
}

const EditMemberDialog: React.FC<EditMemberDialogProps> = ({
  isOpen,
  onOpenChange,
  member,
  onSave,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white/5 border-white/10 text-white sm:max-w-[425px] backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-white">Edit Member</DialogTitle>
          <DialogDescription className="text-slate-400">
            Make changes to the member&apos;s profile here. Click save when you&apos;re
            done.
          </DialogDescription>
        </DialogHeader>
        {member ? (
          <EditMemberForm
            member={member}
            onSave={onSave}
            onCancel={() => onOpenChange(false)}
            onCloseDialog={() => onOpenChange(false)}
          />
        ) : (
          <p className="text-slate-400">No member selected for editing.</p>
        )}
      </DialogContent>
    </Dialog>
  );
};

interface CreateMemberDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (newMember: Member) => void;
}

const CreateMemberDialog: React.FC<CreateMemberDialogProps> = ({
  isOpen,
  onOpenChange,
  onSave,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white/5 border-white/10 text-white sm:max-w-[425px] backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-white">Create New Member</DialogTitle>
          <DialogDescription className="text-slate-400">
            Fill in the details for the new member.
          </DialogDescription>
        </DialogHeader>
        <CreateMemberForm
          onSave={onSave}
          onCloseDialog={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  memberToDelete: Member | null;
  onConfirm: () => void;
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  isOpen,
  onOpenChange,
  memberToDelete,
  onConfirm,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white/5 border-white/10 text-white sm:max-w-[425px] backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-white">Confirm Deletion</DialogTitle>
          <DialogDescription className="text-slate-400">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-white">
              {memberToDelete?.first_name} {memberToDelete?.last_name}
            </span>
            ? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2 mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-white/10 text-white hover:bg-white/10 bg-transparent"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default function MemberManagementPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isViewMemberDialogOpen, setIsViewMemberDialogOpen] = useState(false);
  const [isEditMemberDialogOpen, setIsEditMemberDialogOpen] = useState(false);
  const [isCreateMemberDialogOpen, setIsCreateMemberDialogOpen] =
    useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [membersPerPage] = useState(10);

  const fetchMembers = async () => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        setError("No authentication token found. Please log in.");
        setLoading(false);
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          setError("Authentication failed. Please log in again.");
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      }

      const data: Member[] = await response.json();
      setMembers(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleViewMember = (member: Member) => {
    setSelectedMember(member);
    setIsViewMemberDialogOpen(true);
  };

  const handleEditMember = (member: Member) => {
    setSelectedMember(member);
    setIsEditMemberDialogOpen(true);
  };

  const handleCreateNewMember = () => {
    setIsCreateMemberDialogOpen(true);
  };

  const handleMemberCreated = (newMember: Member) => {
    setMembers((prevMembers) => [newMember, ...prevMembers]);
  };

  const handleMemberUpdated = (updatedMember: Member) => {
    setMembers((prevMembers) =>
      prevMembers.map((m) =>
        m.user_id === updatedMember.user_id ? updatedMember : m
      )
    );
  };

  const handleDeleteMemberClick = (member: Member) => {
    setMemberToDelete(member);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteMember = async () => {
    if (!memberToDelete) return;

    try {
      const token = Cookies.get("token");
      if (!token) {
        setError("No authentication token found. Please log in.");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${memberToDelete.user_id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      setMembers((prevMembers) =>
        prevMembers.filter((m) => m.user_id !== memberToDelete.user_id)
      );
      setIsDeleteDialogOpen(false);
      setMemberToDelete(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to delete member.");
      setIsDeleteDialogOpen(false);
      setMemberToDelete(null);
    }
  };

  const indexOfLastMember = currentPage * membersPerPage;
  const indexOfFirstMember = indexOfLastMember - membersPerPage;
  const currentMembers = members.slice(indexOfFirstMember, indexOfLastMember);

  const totalPages = Math.ceil(members.length / membersPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl lg:text-4xl font-extrabold mb-8 text-center text-white drop-shadow-lg">
          Member Management
        </h1>

        <Card className="bg-white/5 border-white/10 text-white shadow-lg backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl text-white">All Members</CardTitle>
              <CardDescription className="text-slate-400">
                A list of all registered members.
              </CardDescription>
            </div>
            <Button
              onClick={handleCreateNewMember}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white flex items-center gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              Create Member
            </Button>
          </CardHeader>
          <CardContent>
            {loading && (
              <div className="space-y-4">
                <Skeleton className="h-10 w-full bg-white/10" />
                <Skeleton className="h-10 w-full bg-white/10" />
                <Skeleton className="h-10 w-full bg-white/10" />
                <Skeleton className="h-10 w-full bg-white/10" />
              </div>
            )}

            {error && (
              <Alert
                variant="destructive"
                className="bg-red-900/20 border-red-500/30 text-red-200 backdrop-blur-xl"
              >
                <AlertTriangle className="h-4 w-4 text-red-300" />
                <AlertTitle className="text-red-100">Error</AlertTitle>
                <AlertDescription className="text-red-200">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {!loading && !error && (
              <div className="rounded-md border border-white/10 bg-white/5 backdrop-blur-sm">
                <Table>
                  <TableHeader className="bg-white/5">
                    <TableRow className="border-white/10">
                      <TableHead className="text-slate-300">Name</TableHead>
                      <TableHead className="text-slate-300">Position</TableHead>
                      <TableHead className="text-slate-300 sr-only">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentMembers.length > 0 ? (
                      currentMembers.map((member) => (
                        <TableRow
                          key={member.user_id}
                          className="border-white/10 hover:bg-white/10 transition-colors"
                        >
                          <TableCell className="text-slate-200">
                            {member.first_name} {member.last_name}
                          </TableCell>
                          <TableCell className="text-slate-200">
                            {member.position}
                          </TableCell>
                          <TableCell className="text-slate-200">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Open menu</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align="end"
                                className="bg-slate-900 text-white border-white/10"
                              >
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-white/10" />
                                <DropdownMenuItem
                                  onClick={() => handleViewMember(member)}
                                  className="hover:bg-white/10 focus:bg-white/10"
                                >
                                  View member
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleEditMember(member)}
                                  className="hover:bg-white/10 focus:bg-white/10"
                                >
                                  Edit member
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDeleteMemberClick(member)}
                                  className="hover:bg-white/10 focus:bg-white/10 text-red-400 hover:text-red-300"
                                >
                                  Delete member
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="h-24 text-center text-slate-400"
                        >
                          No members found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
                {members.length > membersPerPage && (
                  <Pagination className="py-4">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => {
                            if (currentPage > 1) paginate(currentPage - 1);
                          }}
                          className={currentPage === 1 ? "pointer-events-none opacity-50 text-slate-400" : "text-white hover:bg-white/10"}
                        />
                      </PaginationItem>
                      {Array.from({ length: totalPages }, (_, i) => (
                        <PaginationItem key={i}>
                          <PaginationLink
                            onClick={() => paginate(i + 1)}
                            isActive={currentPage === i + 1}
                            className={currentPage === i + 1 ? "bg-blue-600 hover:bg-blue-700 text-white" : "text-white hover:bg-white/10"}
                          >
                            {i + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => {
                            if (currentPage < totalPages) paginate(currentPage + 1);
                          }}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50 text-slate-400" : "text-white hover:bg-white/10"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <ViewMemberDialog
        isOpen={isViewMemberDialogOpen}
        onOpenChange={setIsViewMemberDialogOpen}
        member={selectedMember}
      />

      <EditMemberDialog
        isOpen={isEditMemberDialogOpen}
        onOpenChange={setIsEditMemberDialogOpen}
        member={selectedMember}
        onSave={handleMemberUpdated}
      />

      <CreateMemberDialog
        isOpen={isCreateMemberDialogOpen}
        onOpenChange={setIsCreateMemberDialogOpen}
        onSave={handleMemberCreated}
      />

      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        memberToDelete={memberToDelete}
        onConfirm={confirmDeleteMember}
      />
    </div>
  );
}
