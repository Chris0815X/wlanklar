import { jsonResponse, leadStore, verifySyncAuth } from "./_shared/lead-utils.mjs";

export default async function leadPull(req) {
  if (req.method !== "GET") {
    return jsonResponse({ ok: false, error: "method_not_allowed" }, 405);
  }

  const authError = verifySyncAuth(req);
  if (authError) return authError;

  const url = new URL(req.url);
  const limit = Math.min(Math.max(Number(url.searchParams.get("limit")) || 25, 1), 100);
  const store = leadStore();
  const { blobs } = await store.list({ prefix: "pending/" });
  const keys = blobs.map((blob) => blob.key).slice(0, limit);
  const leads = [];

  for (const key of keys) {
    const lead = await store.get(key, { type: "json" });
    if (lead) leads.push(lead);
  }

  return jsonResponse({ ok: true, count: leads.length, leads });
}

export const config = {
  path: "/api/lead-pull",
  method: ["GET"],
};
