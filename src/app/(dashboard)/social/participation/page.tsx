import { getEmployeeParticipations, getCsrActivities } from "@/actions/csr-activities";
import { getEsgSettings } from "@/actions/esg-settings";
import { auth } from "@/auth";
import { ParticipationClient } from "./participation-client";

export default async function EmployeeParticipationPage() {
  const [participations, activities, settings, session] = await Promise.all([
    getEmployeeParticipations(),
    getCsrActivities(),
    getEsgSettings(),
    auth(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#09090b] dark:text-white">Employee Participation</h1>
        <p className="text-muted-foreground">
          Track employee volunteer sign-ups, submissions, and reward points
        </p>
      </div>

      <ParticipationClient
        participations={participations}
        activities={activities}
        userRole={(session?.user as any)?.role}
        userId={session?.user?.id}
        isEvidenceRequired={settings?.evidenceRequired}
      />
    </div>
  );
}
