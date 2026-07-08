# WLANklar Astro Website

Aktuelle Website für WLANklar - WLAN-Service vor Ort in der Lausitz und im Spreewald.

Die verbindliche Projektgrundlage liegt in:

- `../docs/WLANKLAR_PROJECT_CONTEXT.md`

## Technischer Stack

- Astro
- React Islands für interaktive Komponenten
- TypeScript
- statischer Build

## Entwicklung

```sh
npm install
npm run dev
npm run build
npm run preview
```

Der lokale Dev-Server läuft standardmäßig unter `http://localhost:4321`.

## Wichtige Dateien

- `src/data/config.ts` - Marke, Kontakt, Region, Tracking-Konfiguration
- `src/data/services.ts` - verbindliche Angebots- und Preisstruktur
- `src/data/travel-zones.ts` - Anfahrtslogik und PLZ-Zonen
- `src/data/faq.ts` - zentrale FAQ-Inhalte
- `src/lib/tracking.ts` - vorbereitete Attribution-/Trackinglogik
- `src/components/islands/ContactWizard.tsx` - Kontaktformular
- `src/components/islands/QuizFunnel.tsx` - Empfehlungs-/Quiz-Funnel
- `src/pages/` - Seitenstruktur
- `src/content/ratgeber/` - Ratgeberartikel

## Seitenstruktur

- `/` Startseite
- `/zuhause-homeoffice/`
- `/ferienwohnungen/`
- `/kleine-bueros/`
- `/einsatzgebiet/`
- `/kontakt/`
- `/impressum/`
- `/datenschutz/`

## Aktuelle Angebote und Preise

### Privatkunden

- WLAN-Check vor Ort: 99 EUR
- WLAN-Komplettpaket: 199 EUR zzgl. Hardware
- Stabiles Heimnetz: ab 499 EUR zzgl. Hardware
- Router-Einrichtung, schnell: 69 EUR zzgl. ggf. Anfahrt
- Repeater-Einrichtung: 69 EUR zzgl. ggf. Anfahrt
- Smart-TV & Streaming: 69 EUR zzgl. ggf. Anfahrt
- Weiteres Telefon im Haus einrichten: ab 49 EUR als Zusatzleistung

Wichtige Preislogik:

- Wenn aus dem WLAN-Check direkt das WLAN-Komplettpaket wird, kostet der Termin 199 EUR gesamt statt 99 EUR + 199 EUR.
- Wenn beim WLAN-Check keine sinnvoll verbesserbare Ursache gefunden wird, werden statt 99 EUR nur 29 EUR Servicepauschale berechnet.

### Ferienwohnungen und Gastgeber

- Gastgeber-Check: 199 EUR
- Gäste-WLAN Komfort: ab 699 EUR zzgl. Hardware
- Saisonstart-Check: ab 349 EUR pro Objekt/Jahr
- Gäste-WLAN-Set mit gedruckten Karten: ab 79 EUR

Weitere digitale Leistungen wie digitale Gästemappe, Bewertungsunterstützung oder kleine Website-/Direktbuchungs-Upsells werden individuell abgestimmt und sind aktuell kein fixes Paket.

### Kleine Büros, Praxen, Studios und Salons

Gewerbliche Preise sind netto zzgl. MwSt.

- Büro-WLAN-Check: 169 EUR zzgl. MwSt.
- Büro-WLAN Setup: ab 599 EUR zzgl. Hardware und MwSt.

### Zusatzzeit

- Privatkunden: 25 EUR je weitere 15 Minuten
- Gewerbekunden: 35 EUR je weitere 15 Minuten

## Anfahrt

- Kerngebiet Lausitz: inklusive
- 16-30 km: +29 EUR
- 31-50 km: +49 EUR
- darüber: nach Absprache
- Spreewald-Orte: nach Entfernungspauschale

Aktuelle PLZ-Logik steht in `src/data/travel-zones.ts`.

## Kontaktformular

Das Kontaktformular ist als mehrstufiger Wizard umgesetzt.

Aktuelle Logik:

- Telefon/WhatsApp oder E-Mail reicht als Kontaktmöglichkeit.
- Ort, PLZ, Objektart, Problemtyp und Kurzbeschreibung helfen bei der Vorbereitung.
- Businesskunden sollen ihr Anliegen frei beschreiben können.
- WhatsApp- und Telefonlinks sind aktiv. E-Mail sowie direkte Baserow-/Backend-Anbindung sind noch offen.

## Tracking

Tracking ist vorbereitet, aber noch nicht extern aktiv.

- Keine externen Pixel oder Analytics-Skripte.
- UTM-/Click-ID-Attribution ist vorbereitet.
- Consent/Cookiebanner muss vor externem Tracking umgesetzt werden.
- Details: `../docs/WLANKLAR_TRACKING_SETUP.md`

## Vor Livegang prüfen

- E-Mail-Adresse in `src/data/config.ts` ergänzen
- Impressum und Datenschutz rechtlich prüfen
- Formularziel für Mail oder Baserow festlegen
- Build ausführen: `npm run build`
- Mobile Darstellung und Kontakt-Wizard testen
- Preise gegen `src/data/services.ts` prüfen
- Keine Du-Ansprache auf der Website
