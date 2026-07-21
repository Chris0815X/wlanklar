import { getFaqEntries } from "./faq";
import { SITE_URL, siteConfig } from "./config";

const serviceTypes = [
  "WLAN-Check & Soforthilfe",
  "WLAN einrichten",
  "Router einrichten",
  "Repeater einrichten",
  "Mesh-WLAN einrichten",
  "Heimnetzwerk einrichten",
  "Gäste-WLAN einrichten",
  "Kunden-WLAN einrichten",
  "Computerhilfe zuhause",
  "Drucker einrichten",
  "Backup einrichten",
];

function normalizeSiteUrl(siteUrl = SITE_URL) {
  return siteUrl.replace(/\/$/, "");
}

export function localBusinessSchema(siteUrl = SITE_URL) {
  const baseUrl = normalizeSiteUrl(siteUrl);

  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${baseUrl}/#business`,
    name: siteConfig.brandName,
    legalName: siteConfig.ownerName,
    vatID: siteConfig.vatId,
    description:
      "WLANklar hilft vor Ort bei WLAN-Problemen, Router, Repeater, Mesh, Heimnetz, Gäste-WLAN, Kunden-WLAN und ausgewählter Technik-Hilfe in Senftenberg, der Lausitz und im Spreewald.",
    url: `${baseUrl}/`,
    priceRange: "€€",
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.street,
      postalCode: siteConfig.postcode,
      addressLocality: siteConfig.city,
      addressCountry: "DE",
    },
    areaServed: siteConfig.cityExamples.map((name) => ({
      "@type": "AdministrativeArea",
      name,
    })),
    serviceType: serviceTypes,
    ...(siteConfig.phone ? { telephone: siteConfig.phone } : {}),
    ...(siteConfig.email ? { email: siteConfig.email } : {}),
  };
}

interface ServiceSchemaInput {
  name: string;
  serviceType: string;
  description?: string;
  url?: string;
  areaServed?: string;
  siteUrl?: string;
}

export function serviceSchema({
  name,
  serviceType,
  description,
  url,
  areaServed = "Senftenberg, Lausitz und Spreewald",
  siteUrl = SITE_URL,
}: ServiceSchemaInput) {
  const baseUrl = normalizeSiteUrl(siteUrl);

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    serviceType,
    ...(description ? { description } : {}),
    ...(url ? { url: new URL(url, `${baseUrl}/`).toString() } : {}),
    provider: {
      "@type": "ProfessionalService",
      name: siteConfig.brandName,
      "@id": `${baseUrl}/#business`,
    },
    areaServed: {
      "@type": "AdministrativeArea",
      name: areaServed,
    },
  };
}

export function faqPageSchema(ids: string[]) {
  const entries = getFaqEntries(ids);
  if (entries.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: entries.map((entry) => ({
      "@type": "Question",
      name: entry.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: entry.answer,
      },
    })),
  };
}

interface ArticleSchemaInput {
  headline: string;
  description: string;
  url: string;
  publishDate: Date;
  updatedDate?: Date;
  siteUrl?: string;
}

export function articleSchema({
  headline,
  description,
  url,
  publishDate,
  updatedDate,
  siteUrl = SITE_URL,
}: ArticleSchemaInput) {
  const baseUrl = normalizeSiteUrl(siteUrl);

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    url: new URL(url, `${baseUrl}/`).toString(),
    datePublished: publishDate.toISOString(),
    ...(updatedDate ? { dateModified: updatedDate.toISOString() } : {}),
    author: {
      "@type": "Organization",
      name: siteConfig.brandName,
      "@id": `${baseUrl}/#business`,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.brandName,
    },
  };
}
