import { useEffect, useRef, useState } from "preact/hooks";
import type { JSX } from "preact";
import { estimateTravel } from "../../lib/travel-lookup";
import { cleanPostcode } from "../../lib/format";
import { buildContactMessage, emailHref, phoneHref, whatsappHref, type ContactFormData } from "../../lib/whatsapp";
import { trackEvent, refreshFormAttribution } from "../../lib/tracking";
import { getService } from "../../data/services";
import { TravelResultBox } from "./TravelResultBox";

type ContactWizardProps = {
  defaultObjectType?: string;
};

function prefillFromQuery(defaultObjectType = ""): ContactFormData {
  const objectType = defaultObjectType ? { objectType: defaultObjectType } : {};
  if (typeof window === "undefined") return objectType;
  const params = new URLSearchParams(window.location.search);
  const leistung = params.get("leistung");
  const service = leistung ? getService(leistung) : undefined;
  if (service) {
    const objectTypeBySegment: Partial<Record<typeof service.segment, string>> = {
      privat: "Zuhause/Homeoffice",
      schnell: "Zuhause/Homeoffice",
      ferienwohnung: "Ferienwohnung/Monteurzimmer",
      buero: "kleines Büro/Praxis/Studio",
      technik: "Technik-Hilfe zuhause",
    };
    const serviceObjectType = { objectType: objectTypeBySegment[service.segment] || defaultObjectType };
    return { ...serviceObjectType, additionalInfo: `Interesse an: ${service.name}` };
  }
  if (params.get("intent") === "erstgespraech") {
    return { ...objectType, additionalInfo: "Wunsch: kostenlos vorab klären. Bitte kurz zurückrufen." };
  }
  return objectType;
}

const objectTypeOptions = [
  "Zuhause/Homeoffice",
  "Ferienwohnung/Monteurzimmer",
  "kleines Büro/Praxis/Studio",
  "Technik-Hilfe zuhause",
];

const homeProblemTypeOptions = [
  "WLAN reicht nicht in alle Räume",
  "Internet ist langsam",
  "Verbindung bricht ab",
  "Smart-TV/Streaming-Probleme",
  "Gäste-WLAN oder QR-Code fehlt",
  "unklare Ursache",
];

const techProblemTypeOptions = [
  "Laptop langsam",
  "Windows-11-Check",
  "neues Gerät einrichten",
  "Datenübernahme",
  "Backup",
  "Drucker/Scanner",
  "Kaufberatung",
  "anderes Technikproblem",
];

const propertyCountOptions = ["1 Objekt", "2–5 Objekte", "6–10 Objekte", "mehr als 10 Objekte", "noch unklar"];

const routerAccessOptions = ["ja, Routerpasswort vorhanden", "nur WLAN-Passwort vorhanden", "nein/unsicher"];
const contactPreferenceOptions = ["Telefon", "WhatsApp", "E-Mail"];

const steps = [
  { title: "Kontakt & Ort", copy: "Damit der Termin eingeordnet und die Anfahrt geprüft werden kann." },
  { title: "Situation", copy: "Was ist betroffen und welche Art von Objekt soll geprüft werden?" },
];

export default function ContactWizard({ defaultObjectType = "" }: ContactWizardProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [data, setData] = useState<ContactFormData>(() =>
    defaultObjectType ? { objectType: defaultObjectType } : {},
  );
  const [contactError, setContactError] = useState("");
  const [submitState, setSubmitState] = useState<"idle" | "submitting" | "prepared" | "error">("idle");
  const [submitError, setSubmitError] = useState("");
  const [preparedLeadId, setPreparedLeadId] = useState("");
  const [preparedMessage, setPreparedMessage] = useState("");
  const stepRefs = [useRef<HTMLFieldSetElement>(null), useRef<HTMLFieldSetElement>(null)];
  const phoneRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const travelEstimate = estimateTravel(data.postcode);
  const isHomeoffice = data.objectType === "Zuhause/Homeoffice";
  const isTechHelp = data.objectType === "Technik-Hilfe zuhause";
  const isHolidayRental = data.objectType === "Ferienwohnung/Monteurzimmer";
  const problemTypeOptions = isTechHelp ? techProblemTypeOptions : homeProblemTypeOptions;
  const showProblemType = isHomeoffice || isTechHelp;

  useEffect(() => {
    setData(prefillFromQuery(defaultObjectType));
  }, [defaultObjectType]);

  function update<K extends keyof ContactFormData>(key: K, value: string) {
    if ((key === "customerPhone" || key === "customerEmail" || key === "preferredContact") && value.trim()) {
      setContactError("");
    }
    setData((current) => ({
      ...current,
      [key]: value,
      ...(key === "objectType" ? { problemType: "", numberOfProperties: "" } : {}),
    }));
  }

  function validateContactMethod(): boolean {
    const phone = data.customerPhone?.trim() || "";
    const email = data.customerEmail?.trim() || "";
    const preferredContact = data.preferredContact?.trim() || "";

    if (!preferredContact) {
      setContactError("Bitte wählen Sie aus, wie wir uns zu dieser Anfrage melden sollen.");
      phoneRef.current?.focus();
      return false;
    }

    if ((preferredContact === "Telefon" || preferredContact === "WhatsApp") && !phone) {
      setContactError(`Für Kontakt per ${preferredContact} bitte Telefon/WhatsApp angeben.`);
      phoneRef.current?.focus();
      return false;
    }

    if (preferredContact === "E-Mail" && !email) {
      setContactError("Für Kontakt per E-Mail bitte eine E-Mail-Adresse angeben.");
      document.getElementById("cw-email")?.focus();
      return false;
    }

    setContactError("");
    return true;
  }

  function validateStep(index: number): boolean {
    const container = stepRefs[index].current;
    if (!container) return true;
    const controls = Array.from(container.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
      "input, select, textarea",
    ));
    const invalid = controls.find((control) => !control.checkValidity());
    if (invalid) {
      invalid.reportValidity();
      invalid.focus();
      return false;
    }
    return true;
  }

  function goTo(index: number) {
    setStepIndex(index);
    requestAnimationFrame(() => {
      stepRefs[index].current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }

  function collectAttribution() {
    const form = formRef.current;
    if (!form) return {};

    const fields = Array.from(form.querySelectorAll<HTMLInputElement>('input[type="hidden"][name^="tracking"]'));
    return fields.reduce<Record<string, string>>((result, field) => {
      result[field.name] = field.value;
      return result;
    }, {});
  }

  async function createLead(message: string) {
    const { numberOfProperties, ...leadData } = data;
    const response = await fetch("/api/lead-create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...leadData,
        number_of_properties: numberOfProperties || "",
        message,
        companyWebsite: (document.getElementById("cw-company-website") as HTMLInputElement | null)?.value || "",
        travel: travelEstimate,
        attribution: collectAttribution(),
        pagePath: typeof window !== "undefined" ? window.location.pathname : "",
      }),
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok || result.ok !== true) {
      throw new Error(response.status === 429 ? "rate_limited" : result.error || "lead_create_failed");
    }

    return String(result.leadId || "");
  }

  function handleNext() {
    if (!validateStep(stepIndex)) return;
    if (stepIndex === 0 && !validateContactMethod()) return;
    if (stepIndex >= steps.length - 1) return;
    goTo(stepIndex + 1);
  }

  async function handleSubmit(event: JSX.TargetedEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError("");
    if (!validateStep(stepIndex)) return;

    refreshFormAttribution(formRef.current);

    if (!validateContactMethod()) {
      goTo(0);
      return;
    }

    const message = buildContactMessage(data, travelEstimate);
    setSubmitState("submitting");

    try {
      const leadId = await createLead(message);
      setPreparedLeadId(leadId);
      setPreparedMessage(message);
      setSubmitState("prepared");

      trackEvent(
        "lead_created",
        {
          lead_channel: data.preferredContact || "",
          lead_id: leadId,
          object_type: data.objectType || "",
          problem_type: data.problemType || "",
          has_email: Boolean(data.customerEmail?.trim()),
          router_access: data.routerAccess || "",
          travel_fee: travelEstimate?.feeText || "",
        },
        { category: "marketing" },
      );
    } catch (error) {
      setPreparedMessage(message);
      setSubmitState("error");
      setSubmitError(
        error instanceof Error && error.message === "rate_limited"
          ? "Es wurden in kurzer Zeit mehrere Anfragen gesendet. Bitte warten Sie eine Minute und versuchen Sie es erneut oder kontaktieren Sie WLANklar per E-Mail oder Telefon."
          : "Die Anfrage konnte gerade nicht gespeichert werden. Sie können die Angaben trotzdem per E-Mail, WhatsApp oder telefonisch übermitteln.",
      );

      trackEvent(
        "lead_prepare_failed",
        {
          lead_channel: data.preferredContact || "",
          object_type: data.objectType || "",
          problem_type: data.problemType || "",
        },
        { category: "marketing" },
      );
    }
  }

  if (submitState === "prepared") {
    const wantsWhatsapp = data.preferredContact === "WhatsApp";

    return (
      <div class="contact-confirmation" role="status" aria-live="polite">
        <span class="badge">Anfrage gespeichert</span>
        <h3>Danke, Ihre Anfrage ist eingegangen.</h3>
        <p>
          Wir melden uns über den gewählten Kontaktweg: <strong>{data.preferredContact}</strong>. WhatsApp wird nur
          genutzt, wenn Sie es ausgewählt haben oder jetzt bewusst zusätzlich öffnen.
        </p>
        {wantsWhatsapp && (
          <p class="contact-privacy-note">
            Mit WhatsApp erlauben Sie WLANklar, zu dieser konkreten Anfrage per WhatsApp zu antworten. Keine Werbung,
            kein Newsletter.
          </p>
        )}
        <div class="btn-row">
          {wantsWhatsapp && (
            <a
              class="btn"
              href={whatsappHref(preparedMessage)}
              target="_blank"
              rel="noopener"
              onClick={() =>
                trackEvent("contact_click", { channel: "whatsapp", lead_id: preparedLeadId }, { category: "marketing" })
              }
            >
              Jetzt WhatsApp öffnen
            </a>
          )}
          {data.preferredContact === "Telefon" && (
            <a class="btn" href={phoneHref()}>
              Jetzt anrufen
            </a>
          )}
          {!wantsWhatsapp && (
            <a
              class="btn btn-secondary"
              href={whatsappHref(preparedMessage)}
              target="_blank"
              rel="noopener"
              onClick={() =>
                trackEvent("contact_click", { channel: "whatsapp", lead_id: preparedLeadId }, { category: "marketing" })
              }
            >
              Optional per WhatsApp senden
            </a>
          )}
          <button type="button" class="btn btn-secondary" onClick={() => setSubmitState("idle")}>
            Angaben ändern
          </button>
        </div>
      </div>
    );
  }

  return (
    <form class="contact-form wizard-ready" ref={formRef} onSubmit={handleSubmit}>
      <div class="wizard-progress" aria-label="Anfragefortschritt">
        {steps.map((step, index) => (
          <span
            class={`wizard-progress-item ${index === stepIndex ? "is-active" : ""} ${index < stepIndex ? "is-done" : ""}`}
          >
            <b>{index + 1}</b>
            <span>{step.title}</span>
          </span>
        ))}
      </div>

      <fieldset class="form-step" hidden={stepIndex !== 0} ref={stepRefs[0]}>
        <legend>{steps[0].title}</legend>
        <p class="step-copy">{steps[0].copy}</p>

        <div class="field">
          <label class="field-label" htmlFor="cw-name">
            Name
          </label>
          <input
            id="cw-name"
            required
            value={data.name || ""}
            onInput={(e) => update("name", (e.target as HTMLInputElement).value)}
          />
        </div>
        <div class="field">
          <label class="field-label" htmlFor="cw-phone">
            Telefon/WhatsApp <span class="is-optional">(oder E-Mail unten)</span>
          </label>
          <input
            id="cw-phone"
            ref={phoneRef}
            value={data.customerPhone || ""}
            onInput={(e) => update("customerPhone", (e.target as HTMLInputElement).value)}
          />
        </div>
        <div class="field">
          <label class="field-label" htmlFor="cw-postcode">
            PLZ des Einsatzortes
          </label>
          <input
            id="cw-postcode"
            required
            inputMode="numeric"
            maxLength={5}
            value={data.postcode || ""}
            onInput={(e) => update("postcode", cleanPostcode((e.target as HTMLInputElement).value))}
          />
          <TravelResultBox estimate={travelEstimate} />
        </div>
        <div class="field">
          <label class="field-label" htmlFor="cw-city">
            Ort
          </label>
          <input
            id="cw-city"
            value={data.city || ""}
            onInput={(e) => update("city", (e.target as HTMLInputElement).value)}
          />
        </div>
        <div class="field">
          <label class="field-label" htmlFor="cw-email">
            E-Mail <span class="is-optional">(oder Telefon oben)</span>
          </label>
          <input
            id="cw-email"
            type="email"
            value={data.customerEmail || ""}
            onInput={(e) => update("customerEmail", (e.target as HTMLInputElement).value)}
          />
        </div>
        <fieldset class="contact-preference">
          <legend>Gewünschter Kontaktweg</legend>
          <div class="contact-choice-grid">
            {contactPreferenceOptions.map((option) => (
              <label class="contact-choice" htmlFor={`cw-contact-${option}`}>
                <input
                  id={`cw-contact-${option}`}
                  type="radio"
                  name="preferredContact"
                  value={option}
                  required
                  checked={data.preferredContact === option}
                  onChange={(e) => update("preferredContact", (e.target as HTMLInputElement).value)}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
          {data.preferredContact === "WhatsApp" && (
            <p class="contact-privacy-note">
              WhatsApp wird nur für diese konkrete Anfrage genutzt. Keine Werbung, kein Newsletter.
            </p>
          )}
        </fieldset>
        <div class="bot-field" aria-hidden="true">
          <label htmlFor="cw-company-website">Website</label>
          <input id="cw-company-website" tabIndex={-1} autoComplete="off" />
        </div>
        {contactError && (
          <p class="form-error">{contactError}</p>
        )}

        <div class="wizard-actions">
          <span />
          <button type="button" class="btn" onClick={handleNext}>
            Weiter
          </button>
        </div>
      </fieldset>

      <fieldset class="form-step" hidden={stepIndex !== 1} ref={stepRefs[1]}>
        <legend>{steps[1].title}</legend>
        <p class="step-copy">{steps[1].copy}</p>

        <div class="field">
          <label class="field-label" htmlFor="cw-object">
            Objektart
          </label>
          <select
            id="cw-object"
            required
            value={data.objectType || ""}
            onChange={(e) => update("objectType", (e.target as HTMLSelectElement).value)}
          >
            <option value="" disabled>
              Bitte wählen
            </option>
            {objectTypeOptions.map((option) => (
              <option value={option}>{option}</option>
            ))}
          </select>
        </div>
        {isHolidayRental && (
          <div class="field">
            <label class="field-label" htmlFor="cw-property-count">
              Wie viele Objekte oder Unterkünfte betrifft die Anfrage? <span class="is-optional">(optional)</span>
            </label>
            <select
              id="cw-property-count"
              value={data.numberOfProperties || ""}
              onChange={(e) => update("numberOfProperties", (e.target as HTMLSelectElement).value)}
            >
              <option value="">Keine Angabe</option>
              {propertyCountOptions.map((option) => (
                <option value={option}>{option}</option>
              ))}
            </select>
          </div>
        )}
        {showProblemType && (
          <div class="field">
            <label class="field-label" htmlFor="cw-problem-type">
              Problemtyp
            </label>
            <select
              id="cw-problem-type"
              required={showProblemType}
              value={data.problemType || ""}
              onChange={(e) => update("problemType", (e.target as HTMLSelectElement).value)}
            >
              <option value="" disabled>
                Bitte wählen
              </option>
              {problemTypeOptions.map((option) => (
                <option value={option}>{option}</option>
              ))}
            </select>
          </div>
        )}
        <div class="field">
          <label class="field-label" htmlFor="cw-router-access">
            Routerzugang
          </label>
          <select
            id="cw-router-access"
            required
            value={data.routerAccess || ""}
            onChange={(e) => update("routerAccess", (e.target as HTMLSelectElement).value)}
          >
            <option value="" disabled>
              Bitte wählen
            </option>
            {routerAccessOptions.map((option) => (
              <option value={option}>{option}</option>
            ))}
          </select>
        </div>
        <div class="field">
          <label class="field-label" htmlFor="cw-problem">
            Kurzbeschreibung
          </label>
          <textarea
            id="cw-problem"
            required
            value={data.problem || ""}
            onInput={(e) => update("problem", (e.target as HTMLTextAreaElement).value)}
          />
        </div>
        <div class="field">
          <label class="field-label" htmlFor="cw-additional">
            Technische Zusatzinfos <span class="is-optional">(optional)</span>
          </label>
          <textarea
            id="cw-additional"
            value={data.additionalInfo || ""}
            onInput={(e) => update("additionalInfo", (e.target as HTMLTextAreaElement).value)}
          />
        </div>
        {submitState === "error" && (
          <div class="form-error">
            <p>{submitError}</p>
            <div class="btn-row">
              <a class="btn btn-small" href={whatsappHref(preparedMessage)} target="_blank" rel="noopener">
                Angaben per WhatsApp senden
              </a>
              <a class="btn btn-secondary btn-small" href={phoneHref()}>
                Anrufen
              </a>
              <a class="btn btn-secondary btn-small" href={emailHref(preparedMessage)}>
                E-Mail schreiben
              </a>
            </div>
          </div>
        )}

        <div class="wizard-actions">
          <button type="button" class="btn btn-secondary" onClick={() => goTo(0)}>
            Zurück
          </button>
          <button type="submit" class="btn" disabled={submitState === "submitting"}>
            {submitState === "submitting" ? "Anfrage wird gesendet..." : "Anfrage senden"}
          </button>
        </div>
      </fieldset>
    </form>
  );
}
