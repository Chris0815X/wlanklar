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

- WLAN-Check & Soforthilfe: 99 EUR
- WLAN-Komplettpaket: 199 EUR zzgl. Hardware
- Stabiles Heimnetz: ab 499 EUR zzgl. Hardware
- Router-Einrichtung, schnell: 69 EUR zzgl. ggf. Anfahrt
- Repeater-Einrichtung: 69 EUR zzgl. ggf. Anfahrt
- Smart-TV verbinden & Streaming prüfen: 69 EUR zzgl. ggf. Anfahrt
- Weiteres Telefon im Haus einrichten: ab 49 EUR als Zusatzleistung

Wichtige Preislogik:

- Wenn aus dem WLAN-Check & Soforthilfe direkt das WLAN-Komplettpaket wird, kostet der Termin 199 EUR gesamt statt 99 EUR + 199 EUR.
- Können wir weder eine nachvollziehbare Ursache feststellen noch eine konkrete sinnvolle Handlungsempfehlung geben, zahlen Sie statt 99 EUR nur 29 EUR Servicepauschale. Eine eingegrenzte Providerstörung, ungeeignete Hardware oder ein problematisches Endgerät mit konkreter Empfehlung ist ein verwertbares Ergebnis.
- Router-Einrichtung, Repeater-Einrichtung und Smart-TV-Service gelten jeweils für vorhandene kompatible Geräte und bis zu 45 Minuten vor Ort. Der genaue Umfang steht in `src/data/services.ts`.

### Ferienwohnungen und Gastgeber

- Gastgeber-Check & Soforthilfe: 199 EUR, bis zu 90 Minuten vor Ort
- Gäste-WLAN Komfort: ab 699 EUR zzgl. Hardware
- Saisonstart-Check: 199 EUR pro Objekt, bis zu 90 Minuten vor Ort
- Gäste-WLAN-Set mit gedruckten Karten: ab 79 EUR

Der Gastgeber-Check & Soforthilfe enthält direkte kleine Korrekturen, einen digitalen WLAN-QR-Code und eine kurze Vermieter-Zusammenfassung. Wird daraus direkt Gäste-WLAN Komfort, kostet der Auftrag ab 699 EUR gesamt statt 199 EUR plus 699 EUR. Alle genannten Preise sind Bruttopreise inklusive Mehrwertsteuer; Hardware kommt nur nach Absprache hinzu.

Weitere digitale Leistungen wie digitale Gästemappe, Bewertungsunterstützung oder kleine Website-/Direktbuchungs-Upsells werden individuell abgestimmt und sind aktuell kein fixes Paket.

### Kleine Büros, Praxen, Studios und Salons

Gewerbliche Preise sind Bruttopreise inklusive Mehrwertsteuer.

- Büro-WLAN-Check & Soforthilfe: 199 EUR inkl. MwSt., bis zu 90 Minuten vor Ort
- Büro-WLAN Setup: ab 599 EUR inkl. MwSt., zzgl. Hardware

Der Büro-WLAN-Check & Soforthilfe enthält direkte kleine Korrekturen und nach Möglichkeit die Wiederanbindung eines einzelnen Netzwerkgeräts. Wird daraus direkt das Büro-WLAN Setup, kostet der Auftrag ab 599 EUR gesamt statt 199 EUR plus 599 EUR.

Zahlung ist bar vor Ort oder per Rechnung und Überweisung möglich. Kartenzahlung wird derzeit nicht angeboten.

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
- Bei Ferienwohnungen und Monteurzimmern erscheint optional die Objektanzahl. Das Request-Feld heißt `number_of_properties` und wird vom privaten Sync-Worker in die technischen Baserow-Infos übernommen.
- WhatsApp- und Telefonlinks sind aktiv.
- Formularanfragen werden über Netlify Functions in Netlify Blobs zwischengespeichert.
- Die Baserow-Synchronisierung erfolgt über den privaten Debian-Sync-Worker in `ops/baserow-sync`.

## Lead Queue

Netlify Functions:

- `POST /api/lead-create` - öffentliches Formularziel, schreibt Leads in Netlify Blobs
- `GET /api/lead-pull` - geschützter Abruf für den späteren Sync-Worker
- `POST /api/lead-ack` - geschützte Bestätigung/Löschung nach Baserow-Sync

Das öffentliche Formularziel ist über Netlify auf maximal 5 Anfragen pro Minute und Kombination aus IP-Adresse und Domain begrenzt. Zusätzlich bleibt das unsichtbare Honeypot-Feld aktiv.

Erforderliche Environment Variable für Worker-Endpunkte:

- `LEAD_SYNC_SECRET`

Der Baserow API-Key gehört nicht in Netlify und nicht in den Browser. Er liegt ausschließlich auf der Debian-VM im Sync-Worker. Installation und Betrieb sind in `ops/baserow-sync/README.md` dokumentiert.

## Bilder

Die Website liefert optimierte WebP-Dateien aus `public/images` aus. Die unkomprimierten PNG-Quelldateien bleiben zur späteren Bearbeitung unter `source-assets/images` erhalten und werden nicht in den öffentlichen Build kopiert.

## Tracking

Tracking ist vorbereitet, aber noch nicht extern aktiv.

- Keine externen Pixel oder Analytics-Skripte.
- UTM-/Click-ID-Attribution ist vorbereitet.
- Consent/Cookiebanner muss vor externem Tracking umgesetzt werden.
- Details: `../docs/WLANKLAR_TRACKING_SETUP.md`

## Vor Livegang prüfen

- Impressum und Datenschutz abschließend rechtlich prüfen
- Debian-Sync-Worker installieren und mit einem eigenen Baserow-Datenbank-Token testen
- Build ausführen: `npm run build`
- Mobile Darstellung und Kontakt-Wizard testen
- Preise gegen `src/data/services.ts` prüfen
- Keine Du-Ansprache auf der Website
