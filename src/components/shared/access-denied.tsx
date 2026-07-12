import Link from "next/link";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function AccessDenied() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-4">
      {/* Background glow effects */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-eco-red/5 blur-3xl -z-10 animate-pulse" />
      
      <Card className="w-full max-w-md glass border-destructive/20 text-center shadow-lg">
        <CardHeader className="space-y-4 pb-2">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive border border-destructive/20">
            <ShieldAlert className="h-7 w-7" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold tracking-tight text-destructive">
              Access Denied
            </CardTitle>
            <CardDescription className="mt-2 text-sm text-muted-foreground">
              You do not have the required privileges to view this section.
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="pt-4 space-y-4">
          <p className="text-xs text-muted-foreground px-4">
            This module is restricted to authorized roles (e.g., Administrator or Sustainability Manager) in accordance with the corporate ESG access policy.
          </p>
          
          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: "default" }),
              "w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white flex items-center justify-center gap-2"
            )}
          >
            <ArrowLeft className="h-4 w-4" />
            Return to Dashboard
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
