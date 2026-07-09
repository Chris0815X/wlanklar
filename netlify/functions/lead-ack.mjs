import { jsonResponse, leadStore, sanitizeText, verifySyncAuth } from "./_shared/lead-utils.mjs";

export default async function leadAck(req) {
  if (req.method !== "POST") {
    return jsonResponse({ ok: false, error: "method_not_allowed" }, 405);
  }

  const authError = verifySyncAuth(req);
  if (authError) return authError;

  let payload;
  try {
    payload = await req.json();
  } catch {
    return jsonResponse({ ok: false, error: "invalid_json" }, 400);
  }

  const ids = Array.isArray(payload.ids) ? payload.ids.map((id) => sanitizeText(id, 120)).filter(Boolean) : [];
  if (!ids.length) {
    return jsonResponse({ ok: false, error: "ids_missing" }, 400);
  }

  const store = leadStore();
  for (const id of ids) {
    await store.delete(`pending/${id}`);
  }

  return jsonResponse({ ok: true, acked: ids.length });
}

export const config = {
  path: "/api/lead-ack",
  method: ["POST"],
};
