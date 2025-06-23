import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Settings, Key, Download, Upload, Eye, EyeOff, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminSettings() {
  const [, setLocation] = useLocation();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const { toast } = useToast();

  const adminUsername = localStorage.getItem('admin_username') || 'admin';

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "New password and confirmation do not match",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    setIsChangingPassword(true);

    try {
      const response = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          username: adminUsername, 
          newPassword 
        }),
      });

      if (response.ok) {
        toast({
          title: "Password Changed",
          description: "Your password has been updated successfully",
        });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setIsPasswordDialogOpen(false);
      } else {
        const error = await response.json();
        toast({
          title: "Password Change Failed",
          description: error.message || "Failed to update password",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Password Change Failed",
        description: "Connection error. Please try again.",
        variant: "destructive",
      });
    }

    setIsChangingPassword(false);
  };

  const handleDownloadBackup = async () => {
    setIsDownloading(true);
    
    try {
      const response = await fetch('/api/backup');
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `integrity_auto_backup_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        toast({
          title: "Backup Downloaded",
          description: "Database backup has been downloaded successfully",
        });
      } else {
        throw new Error('Backup failed');
      }
    } catch (error) {
      toast({
        title: "Backup Failed",
        description: "Failed to download backup. Please try again.",
        variant: "destructive",
      });
    }
    
    setIsDownloading(false);
  };

  const handleRestoreBackup = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsRestoring(true);

    try {
      const fileContent = await file.text();
      const backupData = JSON.parse(fileContent);

      const response = await fetch('/api/restore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(backupData),
      });

      if (response.ok) {
        const result = await response.json();
        toast({
          title: "Backup Restored",
          description: `Restored ${result.restoredCount} items, skipped ${result.skippedCount} duplicates`,
        });
      } else {
        const error = await response.json();
        throw new Error(error.message);
      }
    } catch (error) {
      toast({
        title: "Restore Failed",
        description: error instanceof Error ? error.message : "Failed to restore backup",
        variant: "destructive",
      });
    }

    setIsRestoring(false);
    // Reset the file input
    event.target.value = '';
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_access');
    localStorage.removeItem('adminAuthenticated');
    localStorage.removeItem('admin_login_time');
    localStorage.removeItem('admin_session_token');
    localStorage.removeItem('admin_username');
    
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully",
    });
    
    setLocation('/admin-login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
                  <Settings className="h-6 w-6 text-black" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    Admin Settings
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Manage your account and system preferences
                  </CardDescription>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setLocation('/admin')}
                >
                  Back to Admin
                </Button>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Account Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Account Security
            </CardTitle>
            <CardDescription>
              Manage your login credentials and security settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Username</Label>
                <Input value={adminUsername} disabled className="bg-gray-50" />
              </div>
              <div>
                <Label>Account Status</Label>
                <Input value="Active" disabled className="bg-gray-50" />
              </div>
            </div>
            
            <Separator />
            
            <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full md:w-auto">
                  <Key className="h-4 w-4 mr-2" />
                  Change Password
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Change Password</DialogTitle>
                  <DialogDescription>
                    Enter your new password below. Make sure it's at least 6 characters long.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                        className="pr-10"
                        required
                        minLength={6}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        className="pr-10"
                        required
                        minLength={6}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsPasswordDialogOpen(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isChangingPassword}
                      className="flex-1"
                    >
                      {isChangingPassword ? "Updating..." : "Update Password"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {/* Database Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Database Management
            </CardTitle>
            <CardDescription>
              Backup and restore your database data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Download Backup</Label>
                <Button
                  onClick={handleDownloadBackup}
                  disabled={isDownloading}
                  className="w-full"
                  variant="outline"
                >
                  <Download className="h-4 w-4 mr-2" />
                  {isDownloading ? "Downloading..." : "Download Database Backup"}
                </Button>
                <p className="text-sm text-gray-500">
                  Download a complete backup of all cars, services, and other data
                </p>
              </div>
              
              <div className="space-y-2">
                <Label>Restore from Backup</Label>
                <div className="relative">
                  <Input
                    type="file"
                    accept=".json"
                    onChange={handleRestoreBackup}
                    disabled={isRestoring}
                    className="hidden"
                    id="backup-restore"
                  />
                  <Button
                    onClick={() => document.getElementById('backup-restore')?.click()}
                    disabled={isRestoring}
                    className="w-full"
                    variant="outline"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {isRestoring ? "Restoring..." : "Restore from Backup"}
                  </Button>
                </div>
                <p className="text-sm text-gray-500">
                  Upload a JSON backup file to restore data (skips duplicates)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}