#!/usr/bin/env bash

set -euo pipefail

SOURCE_DIR=${1:?Installationsverzeichnis fehlt}

if ! command -v node >/dev/null 2>&1; then
  printf '\nNode.js wird fuer den WLANklar-Sync installiert.\n'
  sudo apt-get update
  sudo apt-get install -y nodejs
fi

NODE_MAJOR=$(node --version | sed -E 's/^v([0-9]+).*/\1/')
if [[ "$NODE_MAJOR" -lt 18 ]]; then
  printf 'Node.js 18 oder neuer ist erforderlich; gefunden wurde %s.\n' "$(node --version)" >&2
  exit 1
fi

sudo install -d -m 0755 /opt/wlanklar-baserow-sync
sudo install -m 0644 "$SOURCE_DIR/sync.mjs" /opt/wlanklar-baserow-sync/sync.mjs
sudo install -m 0600 "$SOURCE_DIR/wlanklar-baserow-sync.env" /etc/wlanklar-baserow-sync.env
sudo install -m 0644 "$SOURCE_DIR/wlanklar-baserow-sync.service" /etc/systemd/system/wlanklar-baserow-sync.service
sudo install -m 0644 "$SOURCE_DIR/wlanklar-baserow-sync.timer" /etc/systemd/system/wlanklar-baserow-sync.timer

sudo systemctl daemon-reload
sudo systemctl enable --now wlanklar-baserow-sync.timer
sudo systemctl start wlanklar-baserow-sync.service

printf '\nTimer-Status:\n'
sudo systemctl status wlanklar-baserow-sync.timer --no-pager
printf '\nLetzter Sync-Lauf:\n'
sudo journalctl -u wlanklar-baserow-sync.service -n 20 --no-pager
