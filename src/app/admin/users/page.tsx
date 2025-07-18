"use client"

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/lib/convex";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus, Edit, Trash, Mail, Search, Check, X, Shield, Crown, User, Heart } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/main-layout";

export default function AdminUsersPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'member' as 'member' | 'spouse' | 'officer' | 'admin',
    officerTitle: '',
    optIn: true,
    photoUrl: '',
    hobbiesPassions: ''
  });
  const [inviteEmails, setInviteEmails] = useState('');

  // Convex queries and mutations
  const users = useQuery(api.users.listByChapter, { chapterId: "chapter1" });
  const createUser = useMutation(api.users.create);
  const updateUser = useMutation(api.users.update);
  const deleteUser = useMutation(api.users.delete);
  const sendInvites = useMutation(api.users.sendInvites);

  // Redirect if not signed in or not admin
  useEffect(() => {
    if (isLoaded && (!isSignedIn || user?.publicMetadata?.role !== 'admin')) {
      router.push('/');
    }
  }, [isLoaded, isSignedIn, user, router]);

  // Filter users based on search and role
  const filteredUsers = users?.filter(user => {
    const matchesSearch = searchTerm === '' || 
      user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    
    return matchesSearch && matchesRole;
  }) || [];

  // Group users by role
  const usersByRole = {
    admins: filteredUsers.filter(u => u.role === 'admin'),
    officers: filteredUsers.filter(u => u.role === 'officer'),
    members: filteredUsers.filter(u => u.role === 'member'),
    spouses: filteredUsers.filter(u => u.role === 'spouse')
  };

  const handleAddUser = async () => {
    if (!newUser.firstName || !newUser.lastName || !newUser.email) return;
    
    try {
      await createUser({
        chapterId: "chapter1",
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        officerTitle: newUser.officerTitle,
        optIn: newUser.optIn,
        photoUrl: newUser.photoUrl,
        hobbiesPassions: newUser.hobbiesPassions,
      });
      
      setIsAddUserDialogOpen(false);
      setNewUser({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: 'member',
        officerTitle: '',
        optIn: true,
        photoUrl: '',
        hobbiesPassions: ''
      });
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const handleEditClick = (userId: string) => {
    const user = users?.find(u => u._id === userId);
    if (user) {
      setNewUser({
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        phone: user.phone || '',
        role: user.role,
        officerTitle: user.officer_title || '',
        optIn: user.opt_in,
        photoUrl: user.photo_url || '',
        hobbiesPassions: user.hobbies_passions || ''
      });
      setSelectedUserId(userId);
      setIsEditUserDialogOpen(true);
    }
  };

  const handleUpdateUser = async () => {
    if (!selectedUserId || !newUser.firstName || !newUser.lastName || !newUser.email) return;
    
    try {
      await updateUser({
        id: selectedUserId as any,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        phone: newUser.phone,
        photoUrl: newUser.photoUrl,
        hobbiesPassions: newUser.hobbiesPassions,
        optIn: newUser.optIn,
        notificationPreferences: []
      });
      
      setIsEditUserDialogOpen(false);
      setSelectedUserId(null);
      setNewUser({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: 'member',
        officerTitle: '',
        optIn: true,
        photoUrl: '',
        hobbiesPassions: ''
      });
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleDeleteClick = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser({ id: userId as any });
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleSendInvites = async () => {
    if (!inviteEmails.trim()) return;
    
    const emails = inviteEmails.split('\n').map(email => email.trim()).filter(email => email);
    
    try {
      await sendInvites({
        chapterId: "chapter1",
        emails
      });
      
      setIsInviteDialogOpen(false);
      setInviteEmails('');
    } catch (error) {
      console.error('Error sending invites:', error);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-theme-error text-theme-surface border-theme-error hover:bg-theme-error/80";
      case "officer":
        return "bg-theme-primary text-theme-surface border-theme-primary hover:bg-theme-primary/80";
      case "member":
        return "bg-theme-success text-theme-surface border-theme-success hover:bg-theme-success/80";
      case "spouse":
        return "bg-theme-info text-theme-surface border-theme-info hover:bg-theme-info/80";
      default:
        return "bg-theme-text-secondary text-theme-surface border-theme-text-secondary hover:bg-theme-text-secondary/80";
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Shield className="h-4 w-4" />;
      case "officer":
        return <Crown className="h-4 w-4" />;
      case "member":
        return <User className="h-4 w-4" />;
      case "spouse":
        return <Heart className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getOptInStatusColor = (optIn: boolean) => {
    return optIn 
      ? "bg-theme-success/20 text-theme-success border-theme-success" 
      : "bg-theme-error/20 text-theme-error border-theme-error";
  };

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 bg-theme-background min-h-screen">
        <div className="flex flex-col space-y-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold font-heading text-theme-text-primary">Manage Users</h1>
            <div className="flex gap-2">
              <Button 
                onClick={() => setIsInviteDialogOpen(true)}
                className="bg-theme-secondary hover:bg-theme-secondary/80 text-theme-surface font-body"
              >
                <Mail className="mr-2 h-4 w-4" />
                Send Invites
              </Button>
              <Button 
                onClick={() => setIsAddUserDialogOpen(true)}
                className="bg-theme-primary hover:bg-theme-primary/80 text-theme-surface font-body"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-theme-text-secondary" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-theme-surface border-theme-primary/20 text-theme-text-primary font-body"
              />
            </div>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-full sm:w-48 bg-theme-surface border-theme-primary/20 text-theme-text-primary font-body">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-theme-surface border-theme-primary/20">
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admins</SelectItem>
                <SelectItem value="officer">Officers</SelectItem>
                <SelectItem value="member">Members</SelectItem>
                <SelectItem value="spouse">Spouses</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* User Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { role: "admins", label: "Admins", count: usersByRole.admins.length, color: "bg-theme-error" },
              { role: "officers", label: "Officers", count: usersByRole.officers.length, color: "bg-theme-primary" },
              { role: "members", label: "Members", count: usersByRole.members.length, color: "bg-theme-success" },
              { role: "spouses", label: "Spouses", count: usersByRole.spouses.length, color: "bg-theme-info" }
            ].map((stat) => (
              <Card key={stat.role} className="bg-theme-surface border-theme-primary/20 shadow-theme-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-theme-text-secondary font-body">{stat.label}</p>
                      <p className="text-2xl font-bold text-theme-text-primary font-heading">{stat.count}</p>
                    </div>
                    <div className={`p-2 rounded-full ${stat.color}/20`}>
                      {getRoleIcon(stat.role.slice(0, -1))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Users List */}
          <div className="space-y-4">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <Card key={user._id} className="bg-theme-surface border-theme-primary/20 shadow-theme-sm hover:shadow-theme-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12 border-2 border-theme-primary">
                          <AvatarImage src={user.photo_url || "/placeholder-user.jpg"} alt={`${user.first_name} ${user.last_name}`} />
                          <AvatarFallback className="bg-theme-background text-theme-text-primary font-heading">
                            {user.first_name[0]}{user.last_name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-theme-text-primary font-heading">{user.first_name} {user.last_name}</div>
                          <div className="text-sm text-theme-text-secondary font-body">{user.email}</div>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge className={getRoleBadgeColor(user.role)}>
                              {getRoleIcon(user.role)}
                              <span className="ml-1">{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</span>
                            </Badge>
                            {user.officer_title && (
                              <Badge variant="outline" className="border-theme-primary text-theme-primary font-body">
                                {user.officer_title}
                              </Badge>
                            )}
                            <Badge className={getOptInStatusColor(user.opt_in)}>
                              {user.opt_in ? (
                                <>
                                  <Check className="h-3 w-3 mr-1" /> Opted In
                                </>
                              ) : (
                                <>
                                  <X className="h-3 w-3 mr-1" /> Opted Out
                                </>
                              )}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleEditClick(user._id)}
                          className="border-theme-primary text-theme-primary hover:bg-theme-primary hover:text-theme-surface font-body"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleDeleteClick(user._id)}
                          className="border-theme-error text-theme-error hover:bg-theme-error hover:text-theme-surface font-body"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="bg-theme-surface border-theme-primary/20 shadow-theme-sm">
                <CardContent className="p-8 text-center">
                  <p className="text-theme-text-secondary font-body">No users found matching your search criteria.</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Add User Dialog */}
          <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
            <DialogContent className="bg-theme-surface border-theme-primary/20 text-theme-text-primary">
              <DialogHeader>
                <DialogTitle className="font-heading">Add New User</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="font-body">First Name</Label>
                    <Input
                      id="firstName"
                      value={newUser.firstName}
                      onChange={(e) => setNewUser({...newUser, firstName: e.target.value})}
                      className="bg-theme-background border-theme-primary/20 text-theme-text-primary font-body"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="font-body">Last Name</Label>
                    <Input
                      id="lastName"
                      value={newUser.lastName}
                      onChange={(e) => setNewUser({...newUser, lastName: e.target.value})}
                      className="bg-theme-background border-theme-primary/20 text-theme-text-primary font-body"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email" className="font-body">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    className="bg-theme-background border-theme-primary/20 text-theme-text-primary font-body"
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="font-body">Phone</Label>
                  <Input
                    id="phone"
                    value={newUser.phone}
                    onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                    className="bg-theme-background border-theme-primary/20 text-theme-text-primary font-body"
                  />
                </div>
                <div>
                  <Label htmlFor="role" className="font-body">Role</Label>
                  <Select value={newUser.role} onValueChange={(value) => setNewUser({...newUser, role: value as any})}>
                    <SelectTrigger className="bg-theme-background border-theme-primary/20 text-theme-text-primary font-body">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-theme-surface border-theme-primary/20">
                      <SelectItem value="member">Member</SelectItem>
                      <SelectItem value="spouse">Spouse</SelectItem>
                      <SelectItem value="officer">Officer</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {newUser.role === 'officer' && (
                  <div>
                    <Label htmlFor="officerTitle" className="font-body">Officer Title</Label>
                    <Input
                      id="officerTitle"
                      value={newUser.officerTitle}
                      onChange={(e) => setNewUser({...newUser, officerTitle: e.target.value})}
                      className="bg-theme-background border-theme-primary/20 text-theme-text-primary font-body"
                    />
                  </div>
                )}
                <div>
                  <Label htmlFor="hobbies" className="font-body">Hobbies & Passions</Label>
                  <Textarea
                    id="hobbies"
                    value={newUser.hobbiesPassions}
                    onChange={(e) => setNewUser({...newUser, hobbiesPassions: e.target.value})}
                    className="bg-theme-background border-theme-primary/20 text-theme-text-primary font-body"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="optIn"
                    checked={newUser.optIn}
                    onChange={(e) => setNewUser({...newUser, optIn: e.target.checked})}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="optIn" className="font-body">Opted in to share information</Label>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsAddUserDialogOpen(false)}
                    className="border-theme-primary text-theme-primary hover:bg-theme-primary hover:text-theme-surface font-body"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleAddUser}
                    className="bg-theme-primary hover:bg-theme-primary/80 text-theme-surface font-body"
                  >
                    Add User
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Edit User Dialog */}
          <Dialog open={isEditUserDialogOpen} onOpenChange={setIsEditUserDialogOpen}>
            <DialogContent className="bg-theme-surface border-theme-primary/20 text-theme-text-primary">
              <DialogHeader>
                <DialogTitle className="font-heading">Edit User</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="editFirstName" className="font-body">First Name</Label>
                    <Input
                      id="editFirstName"
                      value={newUser.firstName}
                      onChange={(e) => setNewUser({...newUser, firstName: e.target.value})}
                      className="bg-theme-background border-theme-primary/20 text-theme-text-primary font-body"
                    />
                  </div>
                  <div>
                    <Label htmlFor="editLastName" className="font-body">Last Name</Label>
                    <Input
                      id="editLastName"
                      value={newUser.lastName}
                      onChange={(e) => setNewUser({...newUser, lastName: e.target.value})}
                      className="bg-theme-background border-theme-primary/20 text-theme-text-primary font-body"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="editPhone" className="font-body">Phone</Label>
                  <Input
                    id="editPhone"
                    value={newUser.phone}
                    onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                    className="bg-theme-background border-theme-primary/20 text-theme-text-primary font-body"
                  />
                </div>
                <div>
                  <Label htmlFor="editHobbies" className="font-body">Hobbies & Passions</Label>
                  <Textarea
                    id="editHobbies"
                    value={newUser.hobbiesPassions}
                    onChange={(e) => setNewUser({...newUser, hobbiesPassions: e.target.value})}
                    className="bg-theme-background border-theme-primary/20 text-theme-text-primary font-body"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="editOptIn"
                    checked={newUser.optIn}
                    onChange={(e) => setNewUser({...newUser, optIn: e.target.checked})}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="editOptIn" className="font-body">Opted in to share information</Label>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsEditUserDialogOpen(false)}
                    className="border-theme-primary text-theme-primary hover:bg-theme-primary hover:text-theme-surface font-body"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleUpdateUser}
                    className="bg-theme-primary hover:bg-theme-primary/80 text-theme-surface font-body"
                  >
                    Update User
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Invite Dialog */}
          <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
            <DialogContent className="bg-theme-surface border-theme-primary/20 text-theme-text-primary">
              <DialogHeader>
                <DialogTitle className="font-heading">Send Invitations</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="inviteEmails" className="font-body">Email Addresses (one per line)</Label>
                  <Textarea
                    id="inviteEmails"
                    value={inviteEmails}
                    onChange={(e) => setInviteEmails(e.target.value)}
                    placeholder="user1@example.com&#10;user2@example.com"
                    className="bg-theme-background border-theme-primary/20 text-theme-text-primary font-body"
                    rows={5}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsInviteDialogOpen(false)}
                    className="border-theme-primary text-theme-primary hover:bg-theme-primary hover:text-theme-surface font-body"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSendInvites}
                    className="bg-theme-secondary hover:bg-theme-secondary/80 text-theme-surface font-body"
                  >
                    Send Invitations
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </MainLayout>
  );
} 