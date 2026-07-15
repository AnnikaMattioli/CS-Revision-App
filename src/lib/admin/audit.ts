import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

export async function writeAdminAudit(actorId: string, action: string, entityType: string, entityId?: string, metadata: Record<string, unknown> = {}) {
  await createAdminClient().from("admin_audit_logs").insert({ actor_id: actorId, action, entity_type: entityType, entity_id: entityId, metadata });
}
