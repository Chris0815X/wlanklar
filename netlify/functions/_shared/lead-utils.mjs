import { getStore } from "@netlify/blobs";

export const LEAD_STORE_NAME = "wlanklar-leads";

export function leadStore() {
  return getStore({ name: LEAD_STORE_NAME, consistency: "strong" });
}

export function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

export function getEnv(name) {
  return globalThis.Netlify?.env?.get(name) || process.env[name] || "";
}

export function verifySyncAuth(req) {
  const expected = getEnv("LEAD_SYNC_SECRET");
  if (!expected) {
    return jsonResponse({ ok: false, error: "lead_sync_secret_missing" }, 503);
  }

  const authHeader = req.headers.get("authorization") || "";
  const bearer = authHeader.replace(/^Bearer\s+/i, "").trim();
  const querySecret = new URL(req.url).searchParams.get("secret") || "";
  const provided = bearer || querySecret;

  if (!provided || provided !== expected) {
    return jsonResponse({ ok: false, error: "unauthorized" }, 401);
  }

  return null;
}

export function sanitizeText(value, maxLength = 800) {
  if (typeof value !== "string") return "";
  return value.replace(/\s+/g, " ").trim().slice(0, maxLength);
}

export function sanitizeLead(payload) {
  const preferredContact = sanitizeText(payload.preferredContact, 40);

  return {
    name: sanitizeText(payload.name, 120),
    customerPhone: sanitizeText(payload.customerPhone, 80),
    customerEmail: sanitizeText(payload.customerEmail, 160),
    preferredContact,
    postcode: sanitizeText(payload.postcode, 12),
    city: sanitizeText(payload.city, 120),
    objectType: sanitizeText(payload.objectType, 80),
    problemType: sanitizeText(payload.problemType, 120),
    routerAccess: sanitizeText(payload.routerAccess, 120),
    problem: sanitizeText(payload.problem, 1600),
    additionalInfo: sanitizeText(payload.additionalInfo, 1600),
    message: sanitizeText(payload.message, 2600),
    travel: payload.travel && typeof payload.travel === "object" ? payload.travel : null,
    attribution: payload.attribution && typeof payload.attribution === "object" ? payload.attribution : {},
    consent: {
      whatsappContact: preferredContact === "WhatsApp",
      context: "Kontakt nur zur konkreten Anfrage, keine Werbung und kein Newsletter.",
    },
  };
}

export function validateLead(lead) {
  if (!lead.name) return "name_missing";
  if (!lead.postcode) return "postcode_missing";
  if (!lead.objectType) return "object_type_missing";
  if (!lead.routerAccess) return "router_access_missing";
  if (!lead.problem) return "problem_missing";
  if (!lead.preferredContact) return "preferred_contact_missing";

  if ((lead.preferredContact === "Telefon" || lead.preferredContact === "WhatsApp") && !lead.customerPhone) {
    return "phone_missing_for_selected_contact";
  }

  if (lead.preferredContact === "E-Mail" && !lead.customerEmail) {
    return "email_missing_for_selected_contact";
  }

  if (!lead.customerPhone && !lead.customerEmail) {
    return "contact_missing";
  }

  return null;
}

export function makeLeadId() {
  const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, "");
  const uuid = crypto.randomUUID();
  return `${timestamp}-${uuid}`;
}
