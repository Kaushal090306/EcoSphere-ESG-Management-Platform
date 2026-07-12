"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { updateUserProfile } from "@/actions/users";
import { 
  User, 
  Shield, 
  Building2, 
  Lock
} from "lucide-react";

interface ProfileClientProps {
  initialUser: {
    id: string;
    name: string;
    email: string;
    role: "admin" | "esg_manager" | "dept_head" | "employee" | "auditor";
    departmentId: string | null;
    departmentName: string;
    status: "active" | "inactive";
    points: number;
    xp: number;
    createdAt: Date;
  };
}

export function ProfileClient({ initialUser }: ProfileClientProps) {
  const [name, setName] = useState(initialUser.name);
  const [email, setEmail] = useState(initialUser.email);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Compute profile initials
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  // Role display mapping
  const roleDisplay = {
    admin: { label: "System Administrator", color: "bg-[#f4f4f5] dark:bg-[#0c0a0e] text-[#09090b] dark:text-white border-[#ececee] dark:border-[#221f2c]" },
    esg_manager: { label: "ESG Manager", color: "bg-[#f4f4f5] dark:bg-[#0c0a0e] text-[#09090b] dark:text-white border-[#ececee] dark:border-[#221f2c]" },
    dept_head: { label: "Department Head", color: "bg-[#f4f4f5] dark:bg-[#0c0a0e] text-[#09090b] dark:text-white border-[#ececee] dark:border-[#221f2c]" },
    employee: { label: "Employee", color: "bg-[#f4f4f5] dark:bg-[#0c0a0e] text-[#09090b] dark:text-white border-[#ececee] dark:border-[#221f2c]" },
    auditor: { label: "Auditor", color: "bg-[#f4f4f5] dark:bg-[#0c0a0e] text-[#09090b] dark:text-white border-[#ececee] dark:border-[#221f2c]" },
  }[initialUser.role] || { label: "Employee", color: "bg-[#f4f4f5] dark:bg-[#0c0a0e] text-[#09090b] dark:text-white border-[#ececee] dark:border-[#221f2c]" };

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    
    if (!name.trim() || !email.trim()) {
      toast.error("Name and email are required");
      return;
    }

    if (password && password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    const result = await updateUserProfile({
      name,
      email,
      password: password || undefined,
    });
    setLoading(false);

    if (result.success) {
      toast.success("Profile updated successfully");
      setPassword("");
      setConfirmPassword("");
    } else {
      toast.error(result.error || "Failed to update profile");
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-6 w-full">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Left Column: Personal Information & Organization Mapping */}
        <Card className="border border-[#ececee] dark:border-[#221f2c] bg-white dark:bg-[#121118] rounded-xl shadow-xs overflow-hidden py-0">
          <div className="p-6 pb-4 border-b border-[#ececee] dark:border-[#221f2c] flex flex-col sm:flex-row items-center sm:items-start gap-4">
            {/* Minimal Avatar */}
            <div className="h-16 w-16 rounded-full border border-[#ececee] dark:border-[#221f2c] bg-[#f4f4f5] dark:bg-[#0c0a0e] flex items-center justify-center text-[#09090b] dark:text-white text-lg font-bold tracking-tight shrink-0">
              {initials}
            </div>
            
            {/* User Bio and Badges */}
            <div className="flex-1 text-center sm:text-left space-y-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <h3 className="text-lg font-bold text-[#09090b] dark:text-white tracking-tight">{name}</h3>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-medium rounded-md border ${roleDisplay.color} w-fit mx-auto sm:mx-0`}>
                  <Shield className="h-3 w-3 text-purple-500 animate-pulse" />
                  {roleDisplay.label}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{email}</p>
              <div className="inline-flex items-center gap-1 text-[11px] text-muted-foreground font-medium pt-0.5">
                <Building2 className="h-3.5 w-3.5 text-purple-500" />
                {initialUser.departmentName}
              </div>
            </div>
          </div>

          <CardContent className="p-6 space-y-4">
            <h4 className="text-xs uppercase font-bold tracking-wider text-muted-foreground flex items-center gap-2 mb-2">
              <User className="h-3.5 w-3.5 text-purple-500" />
              Personal Details
            </h4>
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-xs font-semibold text-foreground">Full Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Doe"
                  required
                  className="bg-[#f4f4f5] dark:bg-[#0c0a0e] border-[#ececee] dark:border-[#221f2c] text-[#09090b] dark:text-white rounded-lg h-9 text-sm focus-visible:ring-1 focus-visible:ring-purple-500"
                />
              </div>
              
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-semibold text-foreground">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jane.doe@company.com"
                  required
                  className="bg-[#f4f4f5] dark:bg-[#0c0a0e] border-[#ececee] dark:border-[#221f2c] text-[#09090b] dark:text-white rounded-lg h-9 text-sm focus-visible:ring-1 focus-visible:ring-purple-500"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Column: Security & Credentials */}
        <Card className="border border-[#ececee] dark:border-[#221f2c] bg-white dark:bg-[#121118] rounded-xl shadow-xs overflow-hidden flex flex-col justify-between py-0">
          <div>
            <div className="p-6 pb-4 border-b border-[#ececee] dark:border-[#221f2c]">
              <h3 className="text-base font-bold text-foreground tracking-tight">Security Settings</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Manage your credentials and security access.</p>
            </div>
            
            <CardContent className="p-6 space-y-4">
              <h4 className="text-xs uppercase font-bold tracking-wider text-muted-foreground flex items-center gap-2 mb-1">
                <Lock className="h-3.5 w-3.5 text-purple-500" />
                Password Updates
              </h4>
              <p className="text-[11px] text-muted-foreground -mt-2">
                Leave password fields blank if you do not want to change your credentials.
              </p>

              <div className="space-y-4 pt-1">
                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-xs font-semibold text-foreground">New Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="bg-[#f4f4f5] dark:bg-[#0c0a0e] border-[#ececee] dark:border-[#221f2c] text-[#09090b] dark:text-white rounded-lg h-9 text-sm focus-visible:ring-1 focus-visible:ring-purple-500"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <Label htmlFor="confirm-password" className="text-xs font-semibold text-foreground">Confirm New Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="bg-[#f4f4f5] dark:bg-[#0c0a0e] border-[#ececee] dark:border-[#221f2c] text-[#09090b] dark:text-white rounded-lg h-9 text-sm focus-visible:ring-1 focus-visible:ring-purple-500"
                  />
                </div>
              </div>
            </CardContent>
          </div>

          <div className="p-6 bg-[#f4f4f5]/30 dark:bg-[#121118]/50 border-t border-[#ececee] dark:border-[#221f2c] flex justify-end">
            <Button 
              type="submit" 
              disabled={loading} 
              className="bg-[#09090b] dark:bg-[#fafafa] hover:bg-[#18181b] dark:hover:bg-[#e4e4e7] text-white dark:text-[#09090b] rounded-[8px] h-9 text-xs px-5 transition-all font-semibold border border-transparent shadow-xs"
            >
              {loading ? "Saving Changes..." : "Save Profile Changes"}
            </Button>
          </div>
        </Card>
      </div>
    </form>
  );
}
