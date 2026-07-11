#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd)
REMOTE=${1:-chris@100.93.116.80}
REMOTE_WORKER="sync.mjs"
REMOTE_TIMER="wlanklar-baserow-sync.timer"

scp -p \
  "$SCRIPT_DIR/sync.mjs" \
  "$SCRIPT_DIR/wlanklar-baserow-sync.timer" \
  "$REMOTE:"
ssh -t "$REMOTE" \
  "sudo install -m 0644 \"\$HOME/$REMOTE_WORKER\" /opt/wlanklar-baserow-sync/sync.mjs && sudo install -m 0644 \"\$HOME/$REMOTE_TIMER\" /etc/systemd/system/wlanklar-baserow-sync.timer && rm -f \"\$HOME/$REMOTE_WORKER\" \"\$HOME/$REMOTE_TIMER\" && sudo systemctl daemon-reload && sudo systemctl restart wlanklar-baserow-sync.timer && sudo systemctl start wlanklar-baserow-sync.service; sudo systemctl list-timers wlanklar-baserow-sync.timer --no-pager; sudo journalctl -u wlanklar-baserow-sync.service -n 20 --no-pager"
