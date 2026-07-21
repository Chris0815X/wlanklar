const DEFAULT_BATCH_SIZE = 25;
const DEFAULT_TABLE_ID = 819;
const REQUEST_TIMEOUT_MS = 20_000;

function requiredEnv(env, name) {
  const value = env[name]?.trim();
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

export function readConfig(env = process.env) {
  const batchSize = Number(env.SYNC_BATCH_SIZE || DEFAULT_BATCH_SIZE);
  const tableId = Number(env.BASEROW_TABLE_ID || DEFAULT_TABLE_ID);

  if (!Number.isInteger(batchSize) || batchSize < 1 || batchSize > 100) {
    throw new Error("SYNC_BATCH_SIZE must be an integer between 1 and 100");
  }
  if (!Number.isInteger(tableId) || tableId < 1) {
    throw new Error("BASEROW_TABLE_ID must be a positive integer");
  }

  return {
    netlifySiteUrl: requiredEnv(env, "NETLIFY_SITE_URL").replace(/\/$/, ""),
    leadSyncSecret: requiredEnv(env, "LEAD_SYNC_SECRET"),
    baserowUrl: requiredEnv(env, "BASEROW_URL").replace(/\/$/, ""),
    baserowToken: requiredEnv(env, "BASEROW_TOKEN"),
    tableId,
    batchSize,
  };
}

async function requestJson(fetchImpl, url, options = {}) {
  const response = await fetchImpl(url, {
    ...options,
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    const rawDetail = body?.detail || body?.error || response.statusText;
    const detail = typeof rawDetail === "string" ? rawDetail : JSON.stringify(rawDetail);
    throw new Error(`Request failed (${response.status}): ${detail}`);
  }

  return body;
}

function customerType(objectType = "") {
  if (objectType.includes("Ferienwohnung")) return "Ferienwohnung";
  if (objectType.includes("Büro") || objectType.includes("Praxis") || objectType.includes("Studio")) {
    return "kleines Büro";
  }
  if (objectType.includes("Zuhause") || objectType.includes("Homeoffice") || objectType.includes("Technik-Hilfe")) {
    return "Privat";
  }
  return "unklar";
}

function lines(values) {
  return values.filter(Boolean).join("\n");
}

function shortJson(value, maxLength = 1200) {
  const json = JSON.stringify(value || {});
  return json.length > maxLength ? `${json.slice(0, maxLength)}...` : json;
}

function validPhone(value = "") {
  const phone = value.trim();
  return phone.length >= 5 && phone.length <= 80 && /^\+?[0-9][0-9 ()/.-]+$/.test(phone);
}

export function mapLeadToBaserow(lead) {
  const phone = lead.customerPhone?.trim() || "";
  const email = lead.customerEmail?.trim() || "";
  const phoneIsValid = validPhone(phone);
  const travelText = lead.travel
    ? lines([
        lead.travel.feeText && `Anfahrt: ${lead.travel.feeText}`,
        lead.travel.label && `Anfahrtszone: ${lead.travel.label}`,
      ])
    : "";

  const row = {
    Name: lead.name || "Unbekannte Anfrage",
    Status: "Neue Anfrage",
    Kundentyp: customerType(lead.objectType),
    PLZ: lead.postcode || "",
    Ort: lead.city || "",
    Quelle: "Website",
    "Problem / Anfrage": lines([
      lead.problemType && `Situation: ${lead.problemType}`,
      lead.problem,
    ]),
    "Technische Infos": lines([
      lead.number_of_properties && `Objekte/Unterkünfte: ${lead.number_of_properties}`,
      lead.additionalInfo,
      travelText,
    ]),
    Routerzugang: lead.routerAccess || "nein/unsicher",
    "Interne Notizen": lines([
      `External Lead-ID: ${lead.id}`,
      lead.createdAt && `Eingegangen: ${lead.createdAt}`,
      lead.preferredContact && `Gewünschter Kontaktweg: ${lead.preferredContact}`,
      lead.objectType && `Objektart: ${lead.objectType}`,
      phone && !phoneIsValid && `Telefonangabe (nicht als Rufnummer erkannt): ${phone}`,
      `Attribution: ${shortJson(lead.attribution)}`,
    ]),
    Priorität: "normal",
    Rechnungsstatus: "nicht relevant",
  };

  if (phoneIsValid) row["Telefon / WhatsApp"] = phone;
  if (email) row["E-Mail"] = email;

  return row;
}

function baserowRowsUrl(config) {
  return `${config.baserowUrl}/api/database/rows/table/${config.tableId}/?user_field_names=true`;
}

function baserowHeaders(config) {
  return {
    Authorization: `Token ${config.baserowToken}`,
    "Content-Type": "application/json",
  };
}

async function leadAlreadyExists(fetchImpl, config, leadId) {
  const url = new URL(baserowRowsUrl(config));
  url.searchParams.set("search", `External Lead-ID: ${leadId}`);
  url.searchParams.set("size", "1");
  const body = await requestJson(fetchImpl, url, { headers: baserowHeaders(config) });
  return Array.isArray(body.results) && body.results.length > 0;
}

async function createBaserowRow(fetchImpl, config, lead) {
  return requestJson(fetchImpl, baserowRowsUrl(config), {
    method: "POST",
    headers: baserowHeaders(config),
    body: JSON.stringify(mapLeadToBaserow(lead)),
  });
}

async function pullLeads(fetchImpl, config) {
  const url = new URL("/api/lead-pull", config.netlifySiteUrl);
  url.searchParams.set("limit", String(config.batchSize));
  return requestJson(fetchImpl, url, {
    headers: { Authorization: `Bearer ${config.leadSyncSecret}` },
  });
}

async function acknowledgeLeads(fetchImpl, config, ids) {
  return requestJson(fetchImpl, new URL("/api/lead-ack", config.netlifySiteUrl), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.leadSyncSecret}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ids }),
  });
}

export async function syncOnce({ env = process.env, fetchImpl = fetch, logger = console } = {}) {
  const config = readConfig(env);
  const pulled = await pullLeads(fetchImpl, config);
  const leads = Array.isArray(pulled.leads) ? pulled.leads : [];
  const acknowledgedIds = [];
  let created = 0;
  let duplicates = 0;
  let failed = 0;

  for (const lead of leads) {
    if (!lead?.id) {
      failed += 1;
      logger.error("Skipped queue entry without lead ID");
      continue;
    }

    try {
      if (await leadAlreadyExists(fetchImpl, config, lead.id)) {
        duplicates += 1;
      } else {
        await createBaserowRow(fetchImpl, config, lead);
        created += 1;
      }
      acknowledgedIds.push(lead.id);
    } catch (error) {
      failed += 1;
      logger.error(`Lead ${lead.id} was not synchronized: ${error.message}`);
    }
  }

  if (acknowledgedIds.length) {
    await acknowledgeLeads(fetchImpl, config, acknowledgedIds);
  }

  logger.info(
    `Sync complete: pulled=${leads.length} created=${created} duplicates=${duplicates} failed=${failed} acknowledged=${acknowledgedIds.length}`,
  );
  return { pulled: leads.length, created, duplicates, failed, acknowledged: acknowledgedIds.length };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  syncOnce()
    .then((result) => {
      if (result.failed) process.exitCode = 1;
    })
    .catch((error) => {
      console.error(`Sync aborted: ${error.message}`);
      process.exitCode = 1;
    });
}
