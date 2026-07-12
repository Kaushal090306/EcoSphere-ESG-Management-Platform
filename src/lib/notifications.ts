import { getUserNotifications } from "@/actions/notifications";
import type { Notification } from "@/db/schema";

/**
 * Returns a short list of the most recent notifications for the current user.
 * You can adjust the `limit` to fetch more or fewer items.
 * This function can be used throughout the app (e.g., in the header dropdown) to
 * provide real notifications pulled from the database.
 */
export async function getImportantNotifications(limit = 5): Promise<Notification[]> {
  const all = await getUserNotifications();
  // The notifications are already ordered by createdAt descending in the action.
  return all.slice(0, limit);
}
