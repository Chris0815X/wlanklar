// Reine Empfehlungslogik des Quiz-Funnels, portiert aus wlanklar_site/script.js.
// Gibt Service-IDs zurück (statt fertig formatierter Preis-Strings), damit die
// Preisdarstellung zentral aus data/services.ts kommt.

export interface QuizAnswers {
  location: string;
  problem: string;
  devices: string;
  access: string;
  goal: string;
  postcode?: string;
}

export interface QuizRecommendation {
  headline: string;
  recommendation: string;
  serviceIds: string[];
  accessNote?: string;
}

export function recommend(answers: QuizAnswers): QuizRecommendation {
  let headline = "Das klingt nach einem sinnvollen Start mit dem WLAN-Check.";
  let recommendation =
    "WLANklar prüft vor Ort, ob Anschluss, Router, WLAN-Signal, Repeater, Powerline, Kabel oder Endgerät die Ursache sind. Danach erhalten Sie eine passende Empfehlung.";
  let serviceIds = ["wlan-check"];

  if (/Ferienwohnung|Monteurzimmer/.test(answers.location)) {
    headline = "Für Ihre Unterkunft lohnt sich ein professioneller Blick auf WLAN und Gästeinfos.";
    recommendation =
      "Hier geht es nicht nur um Empfang, sondern auch um weniger Rückfragen, klaren WLAN-Zugang, Smart-TV und einen professionellen Eindruck bei Anreise.";
    serviceIds = ["gastgeber-check", "gaeste-wlan-komfort"];
  } else if (/Büro|Praxis|Studio/.test(answers.location)) {
    headline = "Das klingt nach einem Fall für den Büro-WLAN-Check.";
    recommendation =
      "WLANklar prüft vor Ort, warum WLAN, Gästezugang, Drucker, Scanner oder Arbeitsplätze nicht zuverlässig funktionieren, und empfiehlt eine pragmatische Lösung für den kleinen Betrieb.";
    serviceIds = ["buero-check"];
  } else if (
    /Haus mit mehreren Etagen|Homeoffice/.test(answers.location) ||
    /LAN-Kabel|Mesh|Powerline/.test(answers.devices) ||
    /langfristig/.test(answers.goal)
  ) {
    headline = "Das klingt nach einem Heimnetz-Thema, nicht nur nach einem einzelnen Gerät.";
    recommendation =
      "WLANklar prüft vor Ort, welche Verbindung für Ihre Räume zuverlässig ist und ob das WLAN-Komplettpaket oder ein stabiles Heimnetz besser passt.";
    serviceIds = ["wlan-check", "stabiles-heimnetz"];
  } else if (
    /Zuhause\/Wohnung/.test(answers.location) &&
    /möglichst günstig/.test(answers.goal) &&
    /nein/.test(answers.devices)
  ) {
    headline = "Für eine reine Router-Ersteinrichtung kann die Router-Basis-Einrichtung passen.";
    recommendation =
      "Dieses Paket passt, wenn Anschluss, Zugangsdaten und Hardware vorbereitet sind. Wenn die Ursache unklar ist oder mehrere Räume betroffen sind, ist der WLAN-Check der bessere Start.";
    serviceIds = ["router-basis"];
  }

  let accessNote: string | undefined;
  if (/nur WLAN-Passwort|nein|unsicher/.test(answers.access)) {
    accessNote =
      "Auch ohne Routerzugang ist ein erster Check möglich; für konkrete Änderungen am Router wird später Zugriff benötigt.";
  }

  return { headline, recommendation, serviceIds, accessNote };
}
