import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { Header } from "@/components/layout/header";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  // Fetch fresh user data from database to ensure layout stays in sync after profile updates
  const [dbUser] = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
    })
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);

  const currentUser = (dbUser || session.user) as {
    id?: string;
    name?: string | null;
    email?: string | null;
    role?: string;
  };

  return (
    <SidebarProvider>
      <AppSidebar user={currentUser} />
      <SidebarInset>
        <Header user={currentUser} />
        <main className="flex-1 overflow-auto p-6 bg-[#f4f4f5] dark:bg-[#09090b] min-h-screen transition-colors">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
