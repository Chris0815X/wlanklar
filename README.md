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
- `/technik-hilfe/`
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

### Technik-Hilfe zuhause

- Technik-Check zuhause: ab 99 EUR
- Windows-11-Check: ab 79 EUR
- Laptop wieder schneller machen: ab 129 EUR plus Hardware
- Windows neu einrichten: ab 149 EUR
- Neues Gerät startklar machen: ab 149 EUR
- Datenübernahme & Fotos sortieren: ab 99 EUR
- Backup verständlich einrichten: ab 129 EUR
- Drucker oder Scanner ins Netzwerk bringen: ab 79 EUR als Zusatzleistung
- Technik-Kaufberatung: ab 79 EUR

Die Technik-Hilfe ist bewusst als ergänzender Bereich positioniert: ausgewählte Hilfe für Laptop, Windows, Drucker,
Backup, neue Geräte und Kaufberatung; keine professionelle Datenrettung, Smartphone-Hardware-Reparatur oder komplexe
Firmen-IT.

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

Das Kontaktformular ist als zweistufiger Wizard umgesetzt.

Aktuelle Logik:

- Kunden wählen bewusst den gewünschten Kontaktweg: Telefon, WhatsApp oder E-Mail.
- WhatsApp öffnet nicht mehr automatisch nach dem Formular.
- Nach erfolgreicher Speicherung erscheint eine Bestätigung mit optionalem WhatsApp-Button.
- Ort, PLZ, Objektart, Routerzugang und Kurzbeschreibung helfen bei der Vorbereitung.
- Technische Zusatzinfos sind optional im zweiten Schritt gebündelt.
- Auf Bereichsseiten wird die passende Objektart vorgewählt; der Formularablauf bleibt überall gleich.
- Privatkunden und Technik-Hilfe erhalten zusätzlich ein passendes Problemtyp-Dropdown; Business- und Ferienwohnungskunden beschreiben ihr Anliegen frei.
- WhatsApp- und Telefonlinks sind aktiv.
- Formularanfragen werden über Netlify Functions in Netlify Blobs zwischengespeichert.
- Die Baserow-Synchronisierung erfolgt über den privaten Debian-Sync-Worker in `ops/baserow-sync`.

## Lead Queue

Netlify Functions:

- `POST /api/lead-create` - öffentliches Formularziel, schreibt Leads in Netlify Blobs
- `GET /api/lead-pull` - geschützter Abruf für den späteren Sync-Worker
- `POST /api/lead-ack` - geschützte Bestätigung/Löschung nach Baserow-Sync

Erforderliche Environment Variable für Worker-Endpunkte:

- `LEAD_SYNC_SECRET`

Der Baserow API-Key gehört nicht in Netlify und nicht in den Browser. Er liegt ausschließlich auf der Debian-VM im Sync-Worker. Installation und Betrieb sind in `ops/baserow-sync/README.md` dokumentiert.

## Tracking

Tracking ist vorbereitet, aber noch nicht extern aktiv.

- Keine externen Pixel oder Analytics-Skripte.
- UTM-/Click-ID-Attribution ist vorbereitet.
- Consent/Cookiebanner muss vor externem Tracking umgesetzt werden.
- Details: `../docs/WLANKLAR_TRACKING_SETUP.md`

## Vor Livegang prüfen

- E-Mail-Adresse in `src/data/config.ts` ergänzen
- Impressum und Datenschutz rechtlich prüfen
- Debian-Sync-Worker installieren und mit einem eigenen Baserow-Datenbank-Token testen
- Build ausführen: `npm run build`
- Mobile Darstellung und Kontakt-Wizard testen
- Preise gegen `src/data/services.ts` prüfen
- Keine Du-Ansprache auf der Website
