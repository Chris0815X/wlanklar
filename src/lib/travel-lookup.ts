import { postcodeZones } from "../data/travel-zones";
import { cleanPostcode } from "./format";

export interface TravelEstimate {
  postcode: string;
  label: string;
  feeText: string;
  note: string;
}

export function estimateTravel(postcodeInput: string | undefined | null): TravelEstimate | null {
  const postcode = cleanPostcode(postcodeInput);
  if (postcode.length !== 5) return null;

  const match = postcodeZones.find((zone) => zone.postcodes.includes(postcode));
  if (match) {
    return { postcode, label: match.label, feeText: match.feeText, note: match.note };
  }

  return {
    postcode,
    label: "Außerhalb der hinterlegten PLZ-Zonen",
    feeText: "Anfahrt nach Absprache",
    note: "Eine Anfrage ist möglich. Der Termin wird nur bestätigt, wenn Entfernung, Objekt und Auftrag sinnvoll zusammenpassen.",
  };
}

export function travelSummary(estimate: TravelEstimate | null): string {
  if (!estimate) return "";
  return `${estimate.postcode}: ${estimate.feeText} (${estimate.label})`;
}
