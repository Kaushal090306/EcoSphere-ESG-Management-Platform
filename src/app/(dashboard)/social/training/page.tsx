import { getTrainingRecords } from "@/actions/training";
import { db } from "@/db";
import { users } from "@/db/schema";
import { auth } from "@/auth";
import { TrainingClient } from "./training-client";

export default async function TrainingPage() {
  const [records, allUsers, session] = await Promise.all([
    getTrainingRecords(),
    db.select({ id: users.id, name: users.name, role: users.role }).from(users),
    auth(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Training Records</h1>
        <p className="text-muted-foreground">
          Monitor employee ESG-related training and certifications.
        </p>
      </div>

      <TrainingClient 
        records={records} 
        users={allUsers}
        userRole={(session?.user as any)?.role || "employee"}
      />
    </div>
  );
}
