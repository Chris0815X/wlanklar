import { useRef, useState } from "preact/hooks";
import { estimateTravel } from "../../lib/travel-lookup";
import { cleanPostcode } from "../../lib/format";
import { trackEvent } from "../../lib/tracking";
import { TravelResultBox } from "./TravelResultBox";

export default function TravelChecker() {
  const [postcode, setPostcode] = useState("");
  const lastTracked = useRef<string | null>(null);
  const estimate = estimateTravel(postcode);

  function handleInput(value: string) {
    const clean = cleanPostcode(value);
    setPostcode(clean);

    if (clean.length === 5) {
      const result = estimateTravel(clean);
      if (result && lastTracked.current !== result.postcode) {
        lastTracked.current = result.postcode;
        trackEvent(
          "travel_check_completed",
          {
            postcode_prefix: result.postcode.slice(0, 2),
            travel_fee: result.feeText,
            travel_zone: result.label,
          },
          { category: "analytics" },
        );
      }
    }
  }

  return (
    <form
      class="field"
      onSubmit={(event) => event.preventDefault()}
      style={{ maxWidth: "360px" }}
    >
      <label class="field-label" htmlFor="travel-postcode">
        Ihre Postleitzahl
      </label>
      <input
        id="travel-postcode"
        name="postcode"
        inputMode="numeric"
        pattern="[0-9]*"
        maxLength={5}
        placeholder="z. B. 01968"
        value={postcode}
        onInput={(event) => handleInput((event.target as HTMLInputElement).value)}
      />
      <TravelResultBox estimate={estimate} />
    </form>
  );
}
