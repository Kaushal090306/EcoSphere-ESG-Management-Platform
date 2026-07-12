import { auth } from "@/auth";

export async function requireAuth() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  return session.user as any;
}

export async function requireRole(allowedRoles: string[]) {
  const user = await requireAuth();
  if (!allowedRoles.includes(user.role)) {
    throw new Error("Forbidden: Insufficient privileges");
  }
  return user;
}

export async function requireDeptHead(departmentId: string | null) {
  const user = await requireAuth();
  if (user.role === "admin" || user.role === "esg_manager") {
    return user;
  }
  if (user.role === "dept_head" && departmentId) {
    const { db } = await import("@/db");
    const { departments } = await import("@/db/schema/departments");
    const { eq } = await import("drizzle-orm");
    
    const [dept] = await db.select().from(departments).where(eq(departments.id, departmentId)).limit(1);
    if (dept && dept.headUserId === user.id) return user;
  }
  throw new Error("Forbidden: Must be department head");
}
