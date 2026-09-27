# WARDOGS catalogue image audit — 27 Sep 2026

## Inventory and acceptance rule

The baseline catalogue had 101 pending visuals. An image is shown only for a specific record with a local file, an approval entry, an alt description, a source class and date, and a build scope. Historical owner-supplied artwork is identified as such; it is not a current-game screenshot. Unsupported records remain visibly pending.

## Batch 1: owner-provided historical item art

| Group | Previously pending | Owner-pack files matched by SHA-256 | Visually reviewed | Now image-backed |
| --- | ---: | ---: | ---: | ---: |
| Ammunition | 14 | 14 | 14 | 14 |
| Attachments | 40 | 40 | 40 | 40 |
| Gear | 11 | 11 | 11 | 11 |
| Total | 65 | 65 | 65 | 65 |

The originals are in the owner's `C:/Users/user/Downloads/untitled folder 2` pack, imported in August. Sixty local file basenames match the original `group--name.webp` convention. Five ammunition images use normalized local filenames: `12-7x55mm` ← `ammo--127x55mm.webp`, `12g-buck` ← `ammo--loads--12g-BUCK.webp`, `338-norma-magnum-fmj` ← `ammo--loads--338NormanMagnum-FMJ.webp`, `5-45x39mm-fmj` ← `ammo--loads--545mm-FMJ.webp`, and `9mm-fmj` ← `ammo--loads--9mm-FMJ.webp`. Each of these five also matched its original SHA-256 digest. No duplicate file digest was found among the 65 assets.

All 65 assets were visually opened for this audit. Ammunition box labels and the optic/helmet/armor/magazine forms were compared to the record names and owner-pack filenames. No obvious cross-category or mismatched-box exception was found. The unlabeled optic and magazine renderings cannot independently prove current-build identity or capacity; their identity remains attributed to the owner's historical pack, not Team17 or a September live-client capture. The visible card caption must preserve that limitation.

## Remaining research

Seven weapon/vehicle identifiers and 29 other catalogue records still need item-specific or honestly contextual WARDOGS media. The following batches will record a per-item source and frame where obtainable, or an explicit unresolved reason. No unrelated stock photo or competitor-hosted image is accepted.
