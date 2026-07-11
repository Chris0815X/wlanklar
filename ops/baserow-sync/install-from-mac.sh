#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd)
REMOTE=${1:-chris@100.93.116.80}
BASEROW_URL=${BASEROW_URL:-http://100.93.116.80:8080}
KEYCHAIN_SERVICE="WLANklar Netlify Lead Sync"
REMOTE_ARCHIVE=".wlanklar-baserow-sync-install.tgz"

for file in sync.mjs install-on-debian.sh wlanklar-baserow-sync.service wlanklar-baserow-sync.timer; do
  if [[ ! -f "$SCRIPT_DIR/$file" ]]; then
    printf 'Fehlende Installationsdatei: %s\n' "$SCRIPT_DIR/$file" >&2
    exit 1
  fi
done

if ! command -v security >/dev/null 2>&1; then
  printf 'Der macOS-Schluesselbund ist nicht verfuegbar.\n' >&2
  exit 1
fi

LEAD_SYNC_SECRET=$(security find-generic-password -a "$USER" -s "$KEYCHAIN_SERVICE" -w 2>/dev/null || true)
if [[ -z "$LEAD_SYNC_SECRET" ]]; then
  printf 'Der Netlify-Sync-Schluessel wurde nicht im macOS-Schluesselbund gefunden.\n' >&2
  exit 1
fi

printf 'Baserow-Datenbank-Token eingeben (Eingabe bleibt unsichtbar): '
IFS= read -r -s BASEROW_TOKEN
printf '\n'

if [[ -z "$BASEROW_TOKEN" ]]; then
  printf 'Kein Baserow-Token eingegeben. Installation abgebrochen.\n' >&2
  exit 1
fi

TEMP_DIR=$(mktemp -d)
cleanup() {
  unset BASEROW_TOKEN LEAD_SYNC_SECRET
  rm -rf "$TEMP_DIR"
}
trap cleanup EXIT INT TERM
umask 077

printf '%s\n' \
  "NETLIFY_SITE_URL=https://wlanklar.netlify.app" \
  "LEAD_SYNC_SECRET=$LEAD_SYNC_SECRET" \
  "BASEROW_URL=$BASEROW_URL" \
  "BASEROW_TOKEN=$BASEROW_TOKEN" \
  "BASEROW_TABLE_ID=819" \
  "SYNC_BATCH_SIZE=25" \
  > "$TEMP_DIR/wlanklar-baserow-sync.env"

tar -czf "$TEMP_DIR/install.tgz" \
  -C "$SCRIPT_DIR" \
  sync.mjs \
  install-on-debian.sh \
  wlanklar-baserow-sync.service \
  wlanklar-baserow-sync.timer \
  -C "$TEMP_DIR" \
  wlanklar-baserow-sync.env
chmod 600 "$TEMP_DIR/install.tgz"

printf '\nInstallationspaket wird sicher an %s uebertragen.\n' "$REMOTE"
printf 'Das SSH-Passwort wird gegebenenfalls zweimal abgefragt.\n\n'

scp -p "$TEMP_DIR/install.tgz" "$REMOTE:$REMOTE_ARCHIVE"

ssh -t "$REMOTE" \
  "temp_dir=\$(mktemp -d); trap 'rm -rf \"\$temp_dir\" \"\$HOME/$REMOTE_ARCHIVE\"' EXIT; tar -xzf \"\$HOME/$REMOTE_ARCHIVE\" -C \"\$temp_dir\"; bash \"\$temp_dir/install-on-debian.sh\" \"\$temp_dir\""

printf '\nInstallation und erster Sync-Lauf wurden abgeschlossen.\n'
