// Attribution-Erfassung und internes Event-Tracking, portiert aus wlanklar_site/script.js.
// Läuft ausschließlich im Browser. Noch keine Weitergabe an Google/Meta – nur Vorbereitung,
// gated hinter zukünftigem Consent (siehe docs/WLANKLAR_TRACKING_SETUP.md).

import { trackingConfig } from "../data/config";

const isBrowser = typeof window !== "undefined";

const internalAttributionParams = ["wl_landing"];
const trackedParams = Array.from(
  new Set([...trackingConfig.attributionParams, ...trackingConfig.clickIdParams, ...internalAttributionParams]),
);

export interface Attribution {
  source: string;
  medium: string;
  campaign: string;
  content: string;
  term: string;
  gclid: string;
  gbraid: string;
  wbraid: string;
  fbclid: string;
  msclkid: string;
  landingPage: string;
  pagePath: string;
  referrer: string;
  referrerHost: string;
}

export interface TrackedEvent {
  event: string;
  event_id: string;
  event_category: "analytics" | "marketing";
  page_path: string;
  attribution: Attribution;
  [key: string]: unknown;
}

declare global {
  interface Window {
    wlanklarEvents?: TrackedEvent[];
    dataLayer?: unknown[];
    WLANKLAR_CONSENT?: { analytics?: boolean; marketing?: boolean };
  }
}

function getEventQueue(): TrackedEvent[] {
  if (!isBrowser) return [];
  window.wlanklarEvents = window.wlanklarEvents || [];
  return window.wlanklarEvents;
}

function currentUrl(): URL | null {
  if (!isBrowser) return null;
  try {
    return new URL(window.location.href);
  } catch {
    return null;
  }
}

function pagePath(includeSearch = false): string {
  const url = currentUrl();
  if (!url) return "";
  return `${url.pathname}${includeSearch ? url.search : ""}`;
}

function sanitizedReferrer(): string {
  if (!isBrowser || !document.referrer) return "";
  try {
    const referrer = new URL(document.referrer);
    return `${referrer.origin}${referrer.pathname}`;
  } catch {
    return "";
  }
}

function referrerHost(): string {
  if (!isBrowser || !document.referrer) return "";
  try {
    return new URL(document.referrer).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

function queryParams(names: string[]): Record<string, string> {
  const url = currentUrl();
  if (!url) return {};
  return names.reduce<Record<string, string>>((values, name) => {
    const value = url.searchParams.get(name);
    if (value) values[name] = value.slice(0, 180);
    return values;
  }, {});
}

function inferredSource(params: Record<string, string>): string {
  if (params.utm_source) return params.utm_source;
  const host = referrerHost();
  if (!host) return "direct";
  if (/google\./i.test(host)) return "google";
  if (/bing\./i.test(host)) return "bing";
  if (/facebook\.|instagram\.|fb\./i.test(host)) return "meta";
  return host;
}

function inferredMedium(params: Record<string, string>): string {
  if (params.utm_medium) return params.utm_medium;
  const host = referrerHost();
  if (!host) return "direct";
  if (/google\.|bing\./i.test(host)) return "organic";
  if (/facebook\.|instagram\.|fb\./i.test(host)) return "social";
  return "referral";
}

export function getAttribution(): Attribution {
  const params = queryParams(trackedParams);
  return {
    source: inferredSource(params),
    medium: inferredMedium(params),
    campaign: params.utm_campaign || "",
    content: params.utm_content || "",
    term: params.utm_term || "",
    gclid: params.gclid || "",
    gbraid: params.gbraid || "",
    wbraid: params.wbraid || "",
    fbclid: params.fbclid || "",
    msclkid: params.msclkid || "",
    landingPage: params.wl_landing || pagePath(false),
    pagePath: pagePath(false),
    referrer: sanitizedReferrer(),
    referrerHost: referrerHost(),
  };
}

function canForwardEvent(category: "analytics" | "marketing"): boolean {
  if (!isBrowser || trackingConfig.forwardToDataLayer !== true || !Array.isArray(window.dataLayer)) return false;
  if (trackingConfig.requireConsentForExternalTags === false) return true;
  const consent = window.WLANKLAR_CONSENT || {};
  return category === "marketing" ? consent.marketing === true : consent.analytics === true;
}

export function trackEvent(
  eventName: string,
  payload: Record<string, unknown> = {},
  options: { category?: "analytics" | "marketing" } = {},
): TrackedEvent | null {
  if (!isBrowser || trackingConfig.enabled === false) return null;

  const category = options.category || "analytics";
  const event: TrackedEvent = {
    event: eventName,
    event_id: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
    event_category: category,
    page_path: pagePath(false),
    attribution: getAttribution(),
    ...payload,
  };

  getEventQueue().push(event);

  if (trackingConfig.debug) {
    console.info("[WLANklar tracking]", eventName, event);
  }

  if (canForwardEvent(category)) {
    window.dataLayer!.push(event);
  }

  return event;
}

export function propagateAttributionParams(): void {
  if (!isBrowser) return;
  const params = queryParams(trackedParams);
  if (!Object.keys(params).length) return;
  if (!params.wl_landing) params.wl_landing = pagePath(false);

  document.querySelectorAll("a[href]").forEach((link) => {
    const href = link.getAttribute("href");
    if (!href || href.startsWith("#") || /^(mailto:|tel:|https?:\/\/wa\.me\/|javascript:)/i.test(href)) return;

    let url: URL;
    try {
      url = new URL(href, window.location.href);
    } catch {
      return;
    }

    if (!["http:", "https:", "file:"].includes(url.protocol) || url.origin !== window.location.origin) return;

    Object.entries(params).forEach(([key, value]) => {
      if (!url.searchParams.has(key)) url.searchParams.set(key, value);
    });

    const relativePath = href.startsWith("/") ? url.pathname : url.pathname.split("/").pop() || "";
    link.setAttribute("href", `${relativePath}${url.search}${url.hash}`);
  });
}

function setHiddenValue(form: HTMLFormElement, name: string, value: string): void {
  let input = form.querySelector<HTMLInputElement>(`input[type="hidden"][name="${name}"]`);
  if (!input) {
    input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    form.appendChild(input);
  }
  input.value = value || "";
}

export function refreshFormAttribution(form: HTMLFormElement | null): void {
  if (!isBrowser || !form) return;
  const attribution = getAttribution();
  const fields: Record<string, string> = {
    trackingSource: attribution.source,
    trackingMedium: attribution.medium,
    trackingCampaign: attribution.campaign,
    trackingContent: attribution.content,
    trackingTerm: attribution.term,
    trackingGclid: attribution.gclid,
    trackingGbraid: attribution.gbraid,
    trackingWbraid: attribution.wbraid,
    trackingFbclid: attribution.fbclid,
    trackingMsclkid: attribution.msclkid,
    trackingLandingPage: attribution.landingPage,
    trackingPagePath: attribution.pagePath,
    trackingReferrer: attribution.referrer,
    trackingReferrerHost: attribution.referrerHost,
  };
  Object.entries(fields).forEach(([name, value]) => setHiddenValue(form, name, value));
}

function initGlobalClickTracking(): void {
  if (!isBrowser) return;
  document.addEventListener("click", (event) => {
    const link = (event.target as HTMLElement)?.closest?.("a[href]") as HTMLAnchorElement | null;
    if (!link) return;

    const href = link.getAttribute("href") || "";
    const label = (link.textContent || "").trim().slice(0, 80);
    const section =
      link.closest("section")?.id || link.closest("header, footer")?.tagName.toLowerCase() || "";

    if (link.matches('[data-action="whatsapp"]') || /^https:\/\/wa\.me\//i.test(href)) {
      trackEvent("contact_click", { channel: "whatsapp", label, section }, { category: "marketing" });
      return;
    }
    if (link.matches('[data-action="email"]') || href.startsWith("mailto:")) {
      trackEvent("contact_click", { channel: "email", label, section }, { category: "marketing" });
      return;
    }
    if (href.startsWith("tel:")) {
      trackEvent("contact_click", { channel: "phone", label, section }, { category: "marketing" });
      return;
    }
    if (link.classList.contains("btn")) {
      trackEvent("cta_click", { href, label, section }, { category: "analytics" });
    }
  });
}

export function initTracking(): void {
  if (!isBrowser) return;
  propagateAttributionParams();
  initGlobalClickTracking();
}
