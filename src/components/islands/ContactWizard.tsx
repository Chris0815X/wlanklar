import { useRef, useState } from "preact/hooks";
import type { JSX } from "preact";
import { estimateTravel } from "../../lib/travel-lookup";
import { cleanPostcode } from "../../lib/format";
import { buildContactMessage, contactTarget, type ContactFormData } from "../../lib/whatsapp";
import { trackEvent, refreshFormAttribution } from "../../lib/tracking";
import { getService } from "../../data/services";
import { TravelResultBox } from "./TravelResultBox";

function prefillFromQuery(): ContactFormData {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const leistung = params.get("leistung");
  const service = leistung ? getService(leistung) : undefined;
  if (service) return { additionalInfo: `Interesse an: ${service.name}` };
  if (params.get("intent") === "erstgespraech") {
    return { additionalInfo: "Wunsch: kostenloses Erstgespräch – bitte kurz zurückrufen." };
  }
  return {};
}

const objectTypeOptions = ["Zuhause/Homeoffice", "Ferienwohnung/Monteurzimmer", "kleines Büro/Praxis/Studio"];

const problemTypeOptions = [
  "WLAN reicht nicht in alle Räume",
  "Internet ist langsam",
  "Verbindung bricht ab",
  "Smart-TV/Streaming-Probleme",
  "Gäste-WLAN oder QR-Code fehlt",
  "unklare Ursache",
];

const routerAccessOptions = ["ja, Routerpasswort vorhanden", "nur WLAN-Passwort vorhanden", "nein/unsicher"];

const steps = [
  { title: "Kontakt & Ort", copy: "Damit der Termin eingeordnet und die Anfahrt geprüft werden kann." },
  { title: "Situation", copy: "Was ist betroffen und welche Art von Objekt soll geprüft werden?" },
  { title: "Details", copy: "Optional hilfreich für die Vorbereitung, aber kein Pflichtprogramm." },
];

export default function ContactWizard() {
  const [stepIndex, setStepIndex] = useState(0);
  const [data, setData] = useState<ContactFormData>(prefillFromQuery);
  const [showContactError, setShowContactError] = useState(false);
  const stepRefs = [useRef<HTMLFieldSetElement>(null), useRef<HTMLFieldSetElement>(null), useRef<HTMLFieldSetElement>(null)];
  const phoneRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const travelEstimate = estimateTravel(data.postcode);
  const isHomeoffice = data.objectType === "Zuhause/Homeoffice";

  function update<K extends keyof ContactFormData>(key: K, value: string) {
    if ((key === "customerPhone" || key === "customerEmail") && value.trim()) {
      setShowContactError(false);
    }
    setData((current) => ({ ...current, [key]: value }));
  }

  function validateContactMethod(): boolean {
    const hasContact = Boolean(data.customerPhone?.trim() || data.customerEmail?.trim());
    setShowContactError(!hasContact);
    if (!hasContact) {
      phoneRef.current?.focus();
    }
    return hasContact;
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

  function handleNext() {
    if (!validateStep(stepIndex)) return;
    if (stepIndex === 0 && !validateContactMethod()) return;
    goTo(stepIndex + 1);
  }

  function handleSubmit(event: JSX.TargetedEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validateStep(stepIndex)) return;

    refreshFormAttribution(formRef.current);

    if (!validateContactMethod()) {
      goTo(0);
      return;
    }

    const message = buildContactMessage(data, travelEstimate);
    const target = contactTarget(message);

    trackEvent(
      "lead_prepare",
      {
        lead_channel: target.channel,
        object_type: data.objectType || "",
        problem_type: data.problemType || "",
        has_email: Boolean(data.customerEmail?.trim()),
        router_access: data.routerAccess || "",
        travel_fee: travelEstimate?.feeText || "",
      },
      { category: "marketing" },
    );

    window.location.href = target.href;
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
        {showContactError && (
          <p class="form-error">Bitte Telefon/WhatsApp oder E-Mail angeben, damit wir uns melden können.</p>
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
        {isHomeoffice && (
          <div class="field">
            <label class="field-label" htmlFor="cw-problem-type">
              Problemtyp
            </label>
            <select
              id="cw-problem-type"
              required={isHomeoffice}
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

        <div class="wizard-actions">
          <button type="button" class="btn btn-secondary" onClick={() => goTo(0)}>
            Zurück
          </button>
          <button type="button" class="btn" onClick={handleNext}>
            Weiter
          </button>
        </div>
      </fieldset>

      <fieldset class="form-step" hidden={stepIndex !== 2} ref={stepRefs[2]}>
        <legend>{steps[2].title}</legend>
        <p class="step-copy">{steps[2].copy}</p>

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
        <div class="field">
          <label class="field-label" htmlFor="cw-timing">
            Wunschtermin/Dringlichkeit <span class="is-optional">(optional)</span>
          </label>
          <input
            id="cw-timing"
            value={data.timing || ""}
            onInput={(e) => update("timing", (e.target as HTMLInputElement).value)}
          />
        </div>
        <p class="step-copy">Dauert etwa 1 Minute. Pflichtfelder sind markiert.</p>

        <div class="wizard-actions">
          <button type="button" class="btn btn-secondary" onClick={() => goTo(1)}>
            Zurück
          </button>
          <button type="submit" class="btn">
            Anfrage senden
          </button>
        </div>
      </fieldset>
    </form>
  );
}
