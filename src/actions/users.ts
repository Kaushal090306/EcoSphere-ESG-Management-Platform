"use server";

import { db } from "@/db";
import { users, departments } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { checkRole, getSessionUser } from "@/lib/auth-utils";

export async function getUsers() {
  try {
    await checkRole(["admin"]);
  } catch (err: any) {
    throw new Error(err.message || "Unauthorized");
  }
  return db.select().from(users).orderBy(users.name);
}

export async function createUser(data: {
  name: string;
  email: string;
  password?: string;
  role: "admin" | "esg_manager" | "dept_head" | "employee" | "auditor";
  departmentId: string | null;
  status: "active" | "inactive";
}) {
  try {
    await checkRole(["admin"]);
  } catch (err: any) {
    return { error: err.message || "Unauthorized" };
  }

  if (!data.name || !data.email) {
    return { error: "Name and email are required." };
  }

  const password = data.password || "password123";
  const passwordHash = await bcrypt.hash(password, 10);

  try {
    // Check if user already exists
    const [existing] = await db
      .select()
      .from(users)
      .where(eq(users.email, data.email.toLowerCase()))
      .limit(1);

    if (existing) {
      return { error: "A user with this email address already exists." };
    }

    await db.insert(users).values({
      name: data.name,
      email: data.email.toLowerCase(),
      passwordHash,
      role: data.role,
      departmentId: data.departmentId || null,
      status: data.status || "active",
      points: 0,
      xp: 0,
    });

    revalidatePath("/settings/users");
    revalidatePath("/settings");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to create user." };
  }
}

export async function updateUser(
  id: string,
  data: {
    name: string;
    email: string;
    password?: string;
    role: "admin" | "esg_manager" | "dept_head" | "employee" | "auditor";
    departmentId: string | null;
    status: "active" | "inactive";
  }
) {
  try {
    await checkRole(["admin"]);
  } catch (err: any) {
    return { error: err.message || "Unauthorized" };
  }

  if (!data.name || !data.email) {
    return { error: "Name and email are required." };
  }

  try {
    // Check if email taken by someone else
    const [existing] = await db
      .select()
      .from(users)
      .where(eq(users.email, data.email.toLowerCase()))
      .limit(1);

    if (existing && existing.id !== id) {
      return { error: "This email address is already in use by another account." };
    }

    const updateData: any = {
      name: data.name,
      email: data.email.toLowerCase(),
      role: data.role,
      departmentId: data.departmentId || null,
      status: data.status,
      updatedAt: new Date(),
    };

    if (data.password && data.password.trim() !== "") {
      updateData.passwordHash = await bcrypt.hash(data.password, 10);
    }

    await db.update(users).set(updateData).where(eq(users.id, id));

    revalidatePath("/settings/users");
    revalidatePath("/settings");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to update user." };
  }
}

export async function deleteUser(id: string) {
  try {
    await checkRole(["admin"]);
  } catch (err: any) {
    return { error: err.message || "Unauthorized" };
  }

  try {
    await db.delete(users).where(eq(users.id, id));
    revalidatePath("/settings/users");
    revalidatePath("/settings");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to delete user." };
  }
}

export async function getCurrentUserProfile() {
  const sessionUser = await getSessionUser();
  if (!sessionUser?.id) {
    throw new Error("Unauthorized");
  }

  const [result] = await db
    .select({
      user: users,
      departmentName: departments.name,
    })
    .from(users)
    .leftJoin(departments, eq(users.departmentId, departments.id))
    .where(eq(users.id, sessionUser.id))
    .limit(1);

  if (!result) {
    throw new Error("User not found");
  }

  return {
    ...result.user,
    departmentName: result.departmentName || "Unassigned",
  };
}

export async function updateUserProfile(data: {
  name: string;
  email: string;
  password?: string;
}) {
  const sessionUser = await getSessionUser();
  if (!sessionUser?.id) {
    return { error: "Unauthorized" };
  }

  if (!data.name || !data.email) {
    return { error: "Name and email are required." };
  }

  try {
    // Check if email taken by someone else
    const [existing] = await db
      .select()
      .from(users)
      .where(eq(users.email, data.email.toLowerCase()))
      .limit(1);

    if (existing && existing.id !== sessionUser.id) {
      return { error: "This email address is already in use by another account." };
    }

    const updateData: any = {
      name: data.name,
      email: data.email.toLowerCase(),
      updatedAt: new Date(),
    };

    if (data.password && data.password.trim() !== "") {
      updateData.passwordHash = await bcrypt.hash(data.password, 10);
    }

    await db.update(users).set(updateData).where(eq(users.id, sessionUser.id));

    revalidatePath("/settings/profile");
    revalidatePath("/settings");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to update profile." };
  }
}
