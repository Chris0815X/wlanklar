import { siteConfig } from "./config";

export function localBusinessSchema(siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: siteConfig.brandName,
    description:
      "WLANklar hilft bei schlechtem WLAN, Repeater-Frust, Homeoffice-Problemen, Gäste-WLAN und kleinen Netzwerkproblemen – vor Ort in der Lausitz und im Spreewald.",
    areaServed: siteConfig.cityExamples,
    url: siteUrl,
    ...(siteConfig.phone ? { telephone: siteConfig.phone } : {}),
    ...(siteConfig.email ? { email: siteConfig.email } : {}),
  };
}
