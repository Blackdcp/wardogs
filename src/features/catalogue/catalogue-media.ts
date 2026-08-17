import type {ItemTypeId} from "@/features/items/item-library";

export const catalogueMetadataImages: Record<ItemTypeId | "hub", string> = {
  hub: "/images/catalogue/banners/thegame-1280.webp",
  weapons: "/images/catalogue/banners/weapons-1280.webp",
  vehicles: "/images/catalogue/banners/vehicles-1280.webp",
  ammo: "/images/catalogue/ammo/556x45mm.webp",
  attachments: "/images/catalogue/banners/attachments-1280.webp",
  gear: "/images/catalogue/gear/heavy-armor.webp",
  equipment: "/images/catalogue/banners/meta-1280.webp",
  loadouts: "/images/catalogue/banners/loadouts-1280.webp"
};
