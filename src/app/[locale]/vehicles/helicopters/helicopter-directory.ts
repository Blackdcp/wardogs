import type {Locale} from "@/config/site";
import {getLocalizedCatalogueRecords} from "@/features/catalogue/catalogue-localization";
import {getCatalogueRecords} from "@/features/catalogue/catalogue-records";

/** Published aircraft captured in the historical vehicle catalogue. */
export function getHelicopterRecords(locale: Locale) {
  return getLocalizedCatalogueRecords(
    getCatalogueRecords("vehicles").filter((record) =>
      record.filterValues.includes("aircraft") && record.detailStatus === "published" && Boolean(record.detailHref)
    ),
    locale
  );
}
