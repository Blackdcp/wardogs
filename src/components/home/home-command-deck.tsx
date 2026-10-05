import type {Locale} from "@/config/site";
import type {DiscoveryDestination} from "@/features/discovery/discovery-types";
import {HomeHero} from "./home-hero";

export async function HomeCommandDeck({locale, facts, destinations}: {locale: Locale; facts: readonly string[]; destinations: readonly DiscoveryDestination[]}) {
  return HomeHero({locale, facts, command: destinations});
}
