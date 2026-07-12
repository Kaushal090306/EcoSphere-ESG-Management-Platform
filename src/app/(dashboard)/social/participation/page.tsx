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
