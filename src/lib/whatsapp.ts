import { siteConfig } from "../data/config";
import type { QuizAnswers, QuizRecommendation } from "./quiz-logic";
import { travelSummary, type TravelEstimate } from "./travel-lookup";
import { getService } from "../data/services";
import { priceLabel } from "./format";

export interface ContactFormData {
  name?: string;
  customerPhone?: string;
  customerEmail?: string;
  preferredContact?: string;
  postcode?: string;
  city?: string;
  objectType?: string;
  numberOfProperties?: string;
  problemType?: string;
  routerAccess?: string;
  problem?: string;
  additionalInfo?: string;
}

function brand() {
  return siteConfig.brandName || "WLANklar";
}

export function defaultMessage(): string {
  return `Hallo ${brand()}, ich möchte einen Termin anfragen.\n\nName: \nTelefon/WhatsApp: \nE-Mail: \nPLZ/Ort: \nObjekt: Zuhause / Ferienwohnung / kleines Büro\nAnzahl Objekte/Unterkünfte: \nProblemtyp: \nKurzbeschreibung: \nTechnische Zusatzinfos: \nRouterzugang vorhanden?: `;
}

export function whatsappHref(message?: string): string {
  const phone = (siteConfig.whatsappNumber || siteConfig.phone || "").replace(/\D/g, "");
  return phone ? `https://wa.me/${phone}?text=${encodeURIComponent(message || defaultMessage())}` : "#kontakt";
}

export function emailHref(message?: string): string {
  const email = siteConfig.email || "";
  const subject = "Anfrage WLANklar Vor-Ort-Termin";
  if (!email) return "#kontakt";
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message || defaultMessage())}`;
}

export function phoneHref(): string {
  const phone = (siteConfig.phone || siteConfig.phoneDisplay || "").replace(/[^\d+]/g, "");
  return phone ? `tel:${phone}` : "#kontakt";
}

/**
 * CTA für das kostenlose Erstgespräch. Solange keine echte Telefonnummer hinterlegt ist,
 * führt der Weg über das Kontaktformular (mit vorausgefülltem Anliegen), sobald eine Nummer
 * eingetragen wird, wird daraus automatisch ein direkter Anruf-Link.
 */
export function freeCallCta(): { href: string; label: string } {
  const hasPhone = Boolean(siteConfig.phone);
  return hasPhone
    ? { href: phoneHref(), label: "Kostenlos vorab klären" }
    : { href: "/kontakt/?intent=erstgespraech", label: "Kostenlos vorab klären" };
}

export function contactTarget(message: string): { href: string; channel: "whatsapp" | "email" } {
  const target = whatsappHref(message);
  if (target !== "#kontakt") return { href: target, channel: "whatsapp" };
  return { href: emailHref(message), channel: "email" };
}

export function buildContactMessage(data: ContactFormData, travelEstimate: TravelEstimate | null): string {
  const travelLine = travelEstimate ? `\nAnfahrt laut PLZ-Check: ${travelSummary(travelEstimate)}` : "";
  const propertyCountLine = data.numberOfProperties
    ? `\nAnzahl Objekte/Unterkünfte: ${data.numberOfProperties}`
    : "";
  return `Hallo ${brand()}, ich möchte einen Termin anfragen.\n\nName: ${data.name || ""}\nTelefon/WhatsApp: ${
    data.customerPhone || ""
  }\nE-Mail: ${data.customerEmail || ""}\nGewünschter Kontaktweg: ${data.preferredContact || ""}\nPLZ/Ort: ${
    data.postcode || ""
  } ${data.city || ""}${travelLine}\nObjekt: ${
    data.objectType || ""
  }${propertyCountLine}\nProblemtyp: ${data.problemType || ""}\nKurzbeschreibung: ${data.problem || ""}\nTechnische Zusatzinfos: ${
    data.additionalInfo || ""
  }\nRouterzugang vorhanden?: ${data.routerAccess || ""}`;
}

export function buildQuizMessage(answers: QuizAnswers, travelEstimate: TravelEstimate | null): string {
  const travelMessage = travelEstimate
    ? `\nPLZ Einsatzort: ${answers.postcode}\nAnfahrt laut PLZ-Check: ${travelSummary(travelEstimate)}`
    : "\nPLZ Einsatzort: ";
  return `Hallo ${brand()}, ich möchte einen Termin anfragen. Meine Antworten:\nOrt/Objekt: ${answers.location}\nProblem: ${answers.problem}\nVorhandene Geräte: ${answers.devices}\nRouterzugang: ${answers.access}\nWunschlösung: ${answers.goal}${travelMessage}\nName/Ort/Kontakt: `;
}

export function recommendationPackageName(recommendation: QuizRecommendation): string {
  return recommendation.serviceIds
    .map((id) => {
      const service = getService(id);
      if (!service) return null;
      return `${service.name} (${priceLabel(service.price, service.priceFrom, service.priceSuffix)})`;
    })
    .filter(Boolean)
    .join(" oder ");
}
