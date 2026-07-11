# WLANklar Baserow Sync

Der Worker uebertraegt Formularanfragen aus Netlify Blobs in die private Baserow-Tabelle `Anfragen`.

## Ablauf

1. `GET /api/lead-pull` holt maximal 25 offene Anfragen mit Bearer-Authentifizierung.
2. Der Worker sucht die externe Lead-ID in Baserow, um doppelte Datensaetze zu vermeiden.
3. Neue Anfragen werden ueber die private Baserow-API angelegt.
4. Erst nach erfolgreicher Anlage oder erkanntem Duplikat bestaetigt `POST /api/lead-ack` die Anfrage.
5. Der systemd-Timer startet diesen Ablauf alle 30 Minuten.

Der Baserow-Token bleibt ausschliesslich in `/etc/wlanklar-baserow-sync.env` auf der Debian-VM. Baserow muss nicht oeffentlich erreichbar sein.

## Voraussetzungen

- Debian-VM mit Node.js 20 oder neuer
- ausgehender HTTPS-Zugriff auf die WLANklar-Website
- interner Zugriff auf Baserow ueber Tailscale oder LAN
- eigener Baserow-Datenbank-Token mit Schreibzugriff auf Tabelle `819`
- derselbe `LEAD_SYNC_SECRET`, der bei Netlify hinterlegt ist

## Installation auf Debian

### Empfohlen: vom Mac aus

Der Installer fragt den Baserow-Token verdeckt ab. Das SSH-Passwort wird nur von `ssh` beziehungsweise `sudo` angefordert und weder gespeichert noch an Codex uebertragen.

```bash
./install-from-mac.sh
```

Der Netlify-Sync-Schluessel wird dabei aus dem macOS-Schluesselbund `WLANklar Netlify Lead Sync` gelesen.

Spaetere Worker-Updates benoetigen keine erneute Eingabe der Tokens:

```bash
./update-worker-from-mac.sh
```

### Manuell auf Debian

```bash
sudo install -d -m 0755 /opt/wlanklar-baserow-sync
sudo install -m 0644 sync.mjs /opt/wlanklar-baserow-sync/sync.mjs
sudo install -m 0644 wlanklar-baserow-sync.service /etc/systemd/system/
sudo install -m 0644 wlanklar-baserow-sync.timer /etc/systemd/system/
sudo install -m 0600 wlanklar-baserow-sync.env.example /etc/wlanklar-baserow-sync.env
sudo nano /etc/wlanklar-baserow-sync.env
sudo systemctl daemon-reload
sudo systemctl enable --now wlanklar-baserow-sync.timer
sudo systemctl start wlanklar-baserow-sync.service
```

## Kontrolle

```bash
systemctl status wlanklar-baserow-sync.timer
journalctl -u wlanklar-baserow-sync.service -n 50 --no-pager
```

Erfolgreiche Leerlaufmeldung:

```text
Sync complete: pulled=0 created=0 duplicates=0 failed=0 acknowledged=0
```

Personenbezogene Formulardaten werden nicht ins Journal geschrieben. Die Logs enthalten nur Mengen und bei Fehlern die technische Lead-ID.
