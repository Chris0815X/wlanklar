#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd)
REMOTE=${1:-chris@100.93.116.80}
REMOTE_FILE=".wlanklar-baserow-sync.mjs"

scp -p "$SCRIPT_DIR/sync.mjs" "$REMOTE:$REMOTE_FILE"
ssh -t "$REMOTE" \
  "sudo install -m 0644 \"\$HOME/$REMOTE_FILE\" /opt/wlanklar-baserow-sync/sync.mjs && rm -f \"\$HOME/$REMOTE_FILE\" && sudo systemctl start wlanklar-baserow-sync.service; sudo journalctl -u wlanklar-baserow-sync.service -n 20 --no-pager"
