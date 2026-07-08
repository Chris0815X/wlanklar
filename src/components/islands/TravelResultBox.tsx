import type { TravelEstimate } from "../../lib/travel-lookup";

export function TravelResultBox({ estimate }: { estimate: TravelEstimate | null }) {
  if (!estimate) return null;
  return (
    <div class="travel-result">
      <strong>{estimate.feeText}</strong>
      <span>{estimate.label}</span>
      <small>{estimate.note} Die Anzeige ist eine Orientierung, keine verbindliche Preiszusage.</small>
    </div>
  );
}
