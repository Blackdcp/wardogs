import {defineConfig} from "@playwright/test";
import productionLocal from "./production-local.playwright.config";

export default defineConfig(productionLocal, {
  testMatch: ["adsterra-delivery.spec.ts", "adsterra-inventory.spec.ts", "adsterra-sandbox.spec.ts"],
  reporter: [["list"]],
  outputDir: "../.tmp/adsterra-delivery-artifacts"
});
