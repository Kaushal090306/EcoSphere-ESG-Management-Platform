import { auth } from "@/auth";

export async function checkRole(allowedRoles: string[]) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized: Please sign in to perform this action.");
  }
  const userRole = (session.user as any).role || "";
  if (!allowedRoles.includes(userRole)) {
    throw new Error(`Forbidden: You do not have the required role to perform this action.`);
  }
  return session.user;
}

export async function getSessionUser() {
  const session = await auth();
  return session?.user || null;
}
