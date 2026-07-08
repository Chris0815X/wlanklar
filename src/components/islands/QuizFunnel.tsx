import { useState } from "preact/hooks";
import { recommend, type QuizAnswers } from "../../lib/quiz-logic";
import { estimateTravel, travelSummary } from "../../lib/travel-lookup";
import { buildQuizMessage, recommendationPackageName, whatsappHref } from "../../lib/whatsapp";
import { trackEvent } from "../../lib/tracking";
import { cleanPostcode } from "../../lib/format";

const locationOptions = [
  "Zuhause/Wohnung",
  "Haus mit mehreren Etagen",
  "Homeoffice",
  "Ferienwohnung/Monteurzimmer",
  "kleines Büro/Praxis/Studio",
];

const problemOptions = [
  "WLAN reicht nicht in alle Räume",
  "Internet ist langsam",
  "Verbindung bricht ab",
  "Repeater bringt nichts",
  "Smart-TV/Streaming macht Probleme",
  "Gäste-WLAN oder QR-Code fehlt",
  "Drucker/Arbeitsplatzgeräte machen Probleme",
  "ich weiß nicht, woran es liegt",
];

const deviceOptions = ["nein", "Repeater", "Mesh", "Powerline", "LAN-Kabel/Netzwerkdosen", "weiß ich nicht"];

const accessOptions = ["ja, Routerpasswort vorhanden", "nur WLAN-Passwort vorhanden", "nein/unsicher"];

const goalOptions = ["möglichst günstig verbessern", "solide und zuverlässig lösen", "langfristig sauber einrichten"];

export default function QuizFunnel() {
  const [result, setResult] = useState<{
    headline: string;
    body: string;
    packageName: string;
    travelLabel: string;
    waHref: string;
  } | null>(null);

  function handleSubmit(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;

    const answers: QuizAnswers = {
      location: data.location || "",
      problem: data.problem || "",
      devices: data.devices || "",
      access: data.access || "",
      goal: data.goal || "",
      postcode: cleanPostcode(data.postcode),
    };

    const recommendation = recommend(answers);
    const estimate = estimateTravel(answers.postcode);
    const packageName = recommendationPackageName(recommendation);
    const body = recommendation.accessNote
      ? `${recommendation.recommendation} ${recommendation.accessNote}`
      : recommendation.recommendation;
    const message = buildQuizMessage(answers, estimate);

    trackEvent(
      "quiz_completed",
      {
        location_type: answers.location,
        problem_type: answers.problem,
        devices: answers.devices,
        router_access: answers.access,
        goal: answers.goal,
        recommendation: packageName,
        travel_fee: estimate?.feeText || "",
      },
      { category: "marketing" },
    );

    setResult({
      headline: recommendation.headline,
      body,
      packageName,
      travelLabel: estimate ? travelSummary(estimate) : "",
      waHref: whatsappHref(message),
    });
  }

  return (
    <div>
      <form class="quiz-form" onSubmit={handleSubmit}>
        <div class="field">
          <label class="field-label" htmlFor="quiz-location">
            Wo tritt das Problem auf?
          </label>
          <select id="quiz-location" name="location" required>
            {locationOptions.map((option) => (
              <option value={option}>{option}</option>
            ))}
          </select>
        </div>
        <div class="field">
          <label class="field-label" htmlFor="quiz-problem">
            Was nervt am meisten?
          </label>
          <select id="quiz-problem" name="problem" required>
            {problemOptions.map((option) => (
              <option value={option}>{option}</option>
            ))}
          </select>
        </div>
        <div class="field">
          <label class="field-label" htmlFor="quiz-devices">
            Gibt es bereits Zusatzgeräte?
          </label>
          <select id="quiz-devices" name="devices" required>
            {deviceOptions.map((option) => (
              <option value={option}>{option}</option>
            ))}
          </select>
        </div>
        <div class="field">
          <label class="field-label" htmlFor="quiz-access">
            Haben Sie Zugriff auf den Router?
          </label>
          <select id="quiz-access" name="access" required>
            {accessOptions.map((option) => (
              <option value={option}>{option}</option>
            ))}
          </select>
        </div>
        <div class="field">
          <label class="field-label" htmlFor="quiz-goal">
            Was ist Ihnen wichtiger?
          </label>
          <select id="quiz-goal" name="goal" required>
            {goalOptions.map((option) => (
              <option value={option}>{option}</option>
            ))}
          </select>
        </div>
        <div class="field">
          <label class="field-label" htmlFor="quiz-postcode">
            PLZ des Einsatzortes <span class="is-optional">(optional)</span>
          </label>
          <input id="quiz-postcode" name="postcode" inputMode="numeric" maxLength={5} placeholder="z. B. 01968" />
        </div>
        <div>
          <button type="submit" class="btn">
            Einschätzung anzeigen
          </button>
        </div>
      </form>

      {result && (
        <div class="quiz-result">
          <h3>{result.headline}</h3>
          <p>{result.body}</p>
          <p>
            <strong>Empfehlung:</strong> {result.packageName}
          </p>
          {result.travelLabel && (
            <p>
              <strong>Anfahrt laut PLZ-Check:</strong> {result.travelLabel}
            </p>
          )}
          <a class="btn" href={result.waHref} target="_blank" rel="noopener">
            Ergebnis per WhatsApp mitsenden
          </a>
        </div>
      )}
    </div>
  );
}
