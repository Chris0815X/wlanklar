// PLZ-Zonen-Tabelle, portiert aus wlanklar_site/config.js (travel.postcodeZones).

export interface TravelZone {
  postcodes: string[];
  label: string;
  feeText: string;
  note: string;
}

export const travelSettings = {
  coreIncluded: true,
  zone1Price: 29,
  zone2Price: 49,
  spreewaldByDistance: true,
} as const;

export const postcodeZones: TravelZone[] = [
  {
    postcodes: ["01968", "01983"],
    label: "Kerngebiet rund um Senftenberg und Großräschen",
    feeText: "Anfahrt voraussichtlich inklusive",
    note: "Passend für Termine im direkten Kerngebiet. Der genaue Terminrahmen wird trotzdem vor Bestätigung abgestimmt.",
  },
  {
    postcodes: ["01979", "01987", "01945", "02977", "02979", "02991"],
    label: "Lausitz, nähere Umgebung",
    feeText: "voraussichtlich +29 € Anfahrt",
    note: "Typisch für Orte im Umkreis von etwa 16 bis 30 km.",
  },
  {
    postcodes: ["03130", "03205", "03226", "03238"],
    label: "Erweitertes Lausitz- und Spreewaldgebiet",
    feeText: "voraussichtlich +49 € Anfahrt",
    note: "Typisch für Orte im Umkreis von etwa 31 bis 50 km, darunter Vetschau und Raddusch.",
  },
  {
    postcodes: ["03096", "03222", "15907", "15910", "15913"],
    label: "Spreewald-Orte nach Entfernungspauschale",
    feeText: "Anfahrt nach transparenter Entfernungspauschale",
    note: "Für Burg im Spreewald, Lübbenau, Lehde, Leipe, Straupitz, Lübben und Schlepzig wird die Pauschale vor Terminbestätigung genannt.",
  },
];
