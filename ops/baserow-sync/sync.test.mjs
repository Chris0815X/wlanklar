import assert from "node:assert/strict";
import test from "node:test";
import { mapLeadToBaserow, syncOnce } from "./sync.mjs";

const env = {
  NETLIFY_SITE_URL: "https://example.test",
  LEAD_SYNC_SECRET: "sync-secret",
  BASEROW_URL: "http://baserow.test:8080",
  BASEROW_TOKEN: "baserow-token",
  BASEROW_TABLE_ID: "819",
};

const lead = {
  id: "20260711-test-id",
  createdAt: "2026-07-11T10:00:00.000Z",
  name: "Erika Beispiel",
  customerPhone: "+493575000000",
  customerEmail: "erika@example.test",
  preferredContact: "Telefon",
  postcode: "01968",
  city: "Senftenberg",
  objectType: "Zuhause/Homeoffice",
  problemType: "Verbindung bricht ab",
  routerAccess: "ja, Routerpasswort vorhanden",
  problem: "Videokonferenzen brechen im Arbeitszimmer ab.",
  additionalInfo: "FRITZ!Box und ein Repeater vorhanden.",
  travel: { feeText: "Kerngebiet: inklusive", label: "Kerngebiet Lausitz" },
  attribution: { trackingUtmSource: "google" },
};

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

test("maps a website lead to the existing Baserow fields", () => {
  const row = mapLeadToBaserow(lead);
  assert.equal(row.Status, "Neue Anfrage");
  assert.equal(row.Kundentyp, "Privat");
  assert.equal(row.Quelle, "Website");
  assert.match(row["Interne Notizen"], /External Lead-ID: 20260711-test-id/);
  assert.match(row["Problem / Anfrage"], /Videokonferenzen/);
});

test("keeps an invalid optional phone value out of the Baserow phone field", () => {
  const row = mapLeadToBaserow({
    ...lead,
    customerPhone: "Bitte ausschließlich per E-Mail",
    preferredContact: "E-Mail",
  });

  assert.equal(row["Telefon / WhatsApp"], undefined);
  assert.equal(row["E-Mail"], "erika@example.test");
  assert.match(row["Interne Notizen"], /nicht als Rufnummer erkannt/);
});

test("creates and acknowledges a new lead", async () => {
  const requests = [];
  const fetchImpl = async (url, options = {}) => {
    const requestUrl = String(url);
    requests.push({ url: requestUrl, options });
    if (requestUrl.includes("/api/lead-pull")) return jsonResponse({ ok: true, leads: [lead] });
    if (requestUrl.includes("search=")) return jsonResponse({ count: 0, results: [] });
    if (requestUrl.includes("/api/database/rows/table/819/") && options.method === "POST") {
      return jsonResponse({ id: 42 }, 200);
    }
    if (requestUrl.includes("/api/lead-ack")) return jsonResponse({ ok: true, acked: 1 });
    throw new Error(`Unexpected request: ${requestUrl}`);
  };

  const result = await syncOnce({ env, fetchImpl, logger: { info() {}, error() {} } });
  assert.deepEqual(result, { pulled: 1, created: 1, duplicates: 0, failed: 0, acknowledged: 1 });
  assert.equal(requests.filter((request) => request.options.method === "POST").length, 2);
});

test("acknowledges an already imported lead without creating a duplicate", async () => {
  let createCalls = 0;
  const fetchImpl = async (url, options = {}) => {
    const requestUrl = String(url);
    if (requestUrl.includes("/api/lead-pull")) return jsonResponse({ ok: true, leads: [lead] });
    if (requestUrl.includes("search=")) return jsonResponse({ count: 1, results: [{ id: 42 }] });
    if (requestUrl.includes("/api/lead-ack")) return jsonResponse({ ok: true, acked: 1 });
    if (options.method === "POST") createCalls += 1;
    throw new Error(`Unexpected request: ${requestUrl}`);
  };

  const result = await syncOnce({ env, fetchImpl, logger: { info() {}, error() {} } });
  assert.deepEqual(result, { pulled: 1, created: 0, duplicates: 1, failed: 0, acknowledged: 1 });
  assert.equal(createCalls, 0);
});
