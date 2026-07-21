import { jsonResponse, leadStore, makeLeadId, sanitizeLead, validateLead } from "./_shared/lead-utils.mjs";

export default async function leadCreate(req, context) {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204 });
  }

  if (req.method !== "POST") {
    return jsonResponse({ ok: false, error: "method_not_allowed" }, 405);
  }

  const rawBody = await req.text();
  if (rawBody.length > 24_000) {
    return jsonResponse({ ok: false, error: "payload_too_large" }, 413);
  }

  let payload;
  try {
    payload = rawBody ? JSON.parse(rawBody) : {};
  } catch {
    return jsonResponse({ ok: false, error: "invalid_json" }, 400);
  }

  if (typeof payload.companyWebsite === "string" && payload.companyWebsite.trim()) {
    return jsonResponse({ ok: true, ignored: true }, 202);
  }

  const lead = sanitizeLead(payload);
  const validationError = validateLead(lead);
  if (validationError) {
    return jsonResponse({ ok: false, error: validationError }, 400);
  }

  const createdAt = new Date().toISOString();
  const id = makeLeadId();
  const record = {
    id,
    status: "pending",
    source: "website",
    createdAt,
    requestId: context.requestId || "",
    ...lead,
  };

  await leadStore().setJSON(`pending/${id}`, record, {
    metadata: {
      createdAt,
      status: "pending",
      objectType: lead.objectType,
      preferredContact: lead.preferredContact,
    },
  });

  return jsonResponse({ ok: true, leadId: id }, 201);
}

export const config = {
  path: "/api/lead-create",
  method: ["POST", "OPTIONS"],
  rateLimit: {
    windowLimit: 5,
    windowSize: 60,
    aggregateBy: ["ip", "domain"],
  },
};
