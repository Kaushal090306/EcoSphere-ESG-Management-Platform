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
    admin: { label: "System Administrator", color: "bg-[#f4f4f5] dark:bg-[#27272a] text-[#52525b] dark:text-[#a1a1aa] border-[#ececee] dark:border-[#3f3f46]" },
    esg_manager: { label: "ESG Manager", color: "bg-[#f4f4f5] dark:bg-[#27272a] text-[#52525b] dark:text-[#a1a1aa] border-[#ececee] dark:border-[#3f3f46]" },
    dept_head: { label: "Department Head", color: "bg-[#f4f4f5] dark:bg-[#27272a] text-[#52525b] dark:text-[#a1a1aa] border-[#ececee] dark:border-[#3f3f46]" },
    employee: { label: "Employee", color: "bg-[#f4f4f5] dark:bg-[#27272a] text-[#52525b] dark:text-[#a1a1aa] border-[#ececee] dark:border-[#3f3f46]" },
    auditor: { label: "Auditor", color: "bg-[#f4f4f5] dark:bg-[#27272a] text-[#52525b] dark:text-[#a1a1aa] border-[#ececee] dark:border-[#3f3f46]" },
  }[initialUser.role] || { label: "Employee", color: "bg-[#f4f4f5] dark:bg-[#27272a] text-[#52525b] dark:text-[#a1a1aa] border-[#ececee] dark:border-[#3f3f46]" };

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
    <div className="flex justify-start max-w-2xl w-full">
      {/* Single Unified Profile Card */}
      <Card className="border border-[#ececee] dark:border-[#27272a] shadow-xs w-full overflow-hidden">
        
        {/* Unified Card Header (Avatar, Name, Role inline) */}
        <div className="p-6 flex flex-col sm:flex-row items-center sm:items-start gap-4">
          {/* Minimal Avatar */}
          <div className="h-16 w-16 rounded-full border border-[#ececee] dark:border-[#3f3f46] bg-[#fafafa] dark:bg-[#27272a] flex items-center justify-center text-[#18181b] dark:text-[#fafafa] text-lg font-medium tracking-tight shrink-0">
            {initials}
          </div>
          
          {/* User Bio and Badges */}
          <div className="flex-1 text-center sm:text-left space-y-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h3 className="text-lg font-bold text-[#09090b] dark:text-[#fafafa] tracking-tight">{name}</h3>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-medium rounded-md border ${roleDisplay.color} w-fit mx-auto sm:mx-0`}>
                <Shield className="h-3 w-3" />
                {roleDisplay.label}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">{email}</p>
            <div className="inline-flex items-center gap-1 text-[11px] text-muted-foreground font-medium pt-0.5">
              <Building2 className="h-3.5 w-3.5" />
              {initialUser.departmentName}
            </div>
          </div>
        </div>

        <Separator className="border-[#ececee] dark:border-[#27272a]" />

        {/* Unified Card Content: Form details */}
        <CardContent className="p-6">
          <form onSubmit={handleSave} className="space-y-6">
            
            {/* Personal Details */}
            <div className="space-y-4">
              <h4 className="text-xs uppercase font-bold tracking-wider text-muted-foreground flex items-center gap-2">
                <User className="h-3.5 w-3.5" />
                Personal Details
              </h4>
              
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-xs">Full Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe"
                    required
                    className="rounded-[8px] h-9 text-sm"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jane.doe@company.com"
                    required
                    className="rounded-[8px] h-9 text-sm"
                  />
                </div>
              </div>
            </div>

            <Separator className="border-[#ececee] dark:border-[#27272a]" />

            {/* Change Password */}
            <div className="space-y-4">
              <h4 className="text-xs uppercase font-bold tracking-wider text-muted-foreground flex items-center gap-2">
                <Lock className="h-3.5 w-3.5" />
                Security
              </h4>
              <p className="text-[11px] text-muted-foreground -mt-2">
                Leave password fields blank if you do not want to change your credentials.
              </p>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-xs">New Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="rounded-[8px] h-9 text-sm"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <Label htmlFor="confirm-password" className="text-xs">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="rounded-[8px] h-9 text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button 
                type="submit" 
                disabled={loading} 
                className="bg-[#09090b] dark:bg-[#fafafa] hover:bg-[#18181b] dark:hover:bg-[#e4e4e7] text-white dark:text-[#09090b] rounded-[8px] h-9 text-xs px-5 transition-all font-medium border border-transparent"
              >
                {loading ? "Saving Changes..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
