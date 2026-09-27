# `catalogue_images.zip` 接收审计（2026-09-27）

后续执行状态（同日）：用户明确授权使用这批素材并要求上线。已按安全路径校验将 169 张 WebP 导入 `public/images/catalogue/imported/`；其中 74 张用于新增目录条目，14 张匹配原有空图，21 个皮肤条目单独建目录（20 张候选图片、1 个仍待核实的占位）。下文保留导入前审计快照，因此“尚未复制”等表述仅指当时状态。

压缩包：`C:/Users/user/Downloads/catalogue_images.zip`，4,372,501 字节。此记录只做清单和字节检查；尚未将压缩包里的图片复制到网站，也未修改线上图片。

## 文件清点

| 目录 | WebP 数量 | 与本站缺口的关系 |
| --- | ---: | --- |
| `gear` | 14 | 对应前次核出的 14 个背心、背包、降落伞候选名称 |
| `vehicles` | 2 | 对应 Z20 Lakota 和 Miniguns 两个候选名称 |
| `equipment` | 58 | 竞品设备素材全集，需与本站既有 18 条和 43 个名称缺口去重、核对别名 |
| `attachments` | 71 | 含前次核出的 15 个缺失弹匣，还含大量前次菜单对照未列出的瞄具、握把、枪口等文件；文件存在不等于当前游戏内条目存在 |
| `cosmetics` | 24 | 约 21 个皮肤候选和 3 个表情文件；不能按 24 个皮肤入库 |
| **合计** | **169** | 160 个独立 SHA-256 文件内容 |

`manifest.json` 为全部 169 个图片逐条记录了 `wardogshub.gg` 资产 URL。用户说明图片由自己保存、URL 用于标识；这说明取得了本地副本，但尚不能据此确认有在本站重新托管和公开使用这些图片的许可。许可未核清前，它们仅作为名称/画面核对参考，不直接发布。

按竞品当前五个目录页面和此前逐项差距清单**逐条对照文件名**，95 个候选缺口全部找到了压缩包内候选文件：装备 14/14、弹匣 15/15、Z20 2/2、设备 43/43、皮肤 21/21。因此不能说这批竞品缺口的图片“包里没有”。这个 95/95 只表示文件名有对应候选，不代表每张图的物品身份、画面内容与再发布许可都已通过验收。

## 需要人工核对的文件

- 四张配件图分别同字节：`m249-bipod`、`pkm-bipod`、`sks-bipod`、`bipod`。
- 四张瞄具图分别同字节：`6x-precision-rifle-scope`、`6x-marksman-scope-reflex`、`3x-6x-lpvo-short-dot`、`frontier-2-5x-10x-precision-scope`。
- 两张钥匙卡图同字节：`bravo-card`、`charlie-card`。
- 两张握把图同字节：`rvg-vertical-foregrip`、`angled-tactical-foregrip`。
- 两张脚架图同字节：`sv98-bipod`、`pro-tilt-bipod`。

这些组合可能是同一种外观复用，也可能是竞品图片复用或误配；不能仅凭文件名宣称每件物品有独立、正确的图片。

皮肤文件还出现 `twotonedesert-ax50` 对照文字目录的 `AMR 50`、`twotonedesert-mp9` 对照 `AMP-9`、`factionlogo-wepn_033` 对照 `Bushmaster M17S` 等名称差异。图片与具体游戏物品的关系须先核实，不能机械改名。

已打开上述别名样本：`smokegrenade` 显示 M18 SMOKE 罐，`c4trigger` 显示遥控器，`repairtool` 显示扳手，`buildtool` 显示锤子，`largebattery` 显示大型电池，`keycard` 显示卡片，`crowbar` 显示撬棍；这些是合理的**外观候选**。`twotonedesert-mp9` 与 `twotonedesert-ax50` 显示具体枪械造型，但单看图不能确认目录里的 AMP-9 / AMR 50 名称。`factionlogo-wepn_033` 显示阵营徽标而不是 Bushmaster 武器或其皮肤效果，不能当成“该枪皮肤实物图”。

## 未覆盖的旧空图

压缩包没有以 `weapons`、`medical`、`supplies`、`deployables`、`mechanics`、`maps` 命名的目录；**目录名不同不等于没有对应图片**。例如 `equipment/defibrillator.webp` 可对照本站 `medical/defibrillator`，`equipment/atmine.webp` 可对照 `deployables/at-mine`。这两项目前只是文件名匹配，仍需看图确认物品身份。

按文件名初筛，本站原有 36 个空图里至少有以下直接对应候选：设备 5 个（binoculars、rangefinder、fuel-can/fuelcan、repair-tool/repairtool、battery），医疗 3 个（stimpen、enox、defibrillator），补给 4 个（buildtoolsupply、munitionssupplies、fuelsupplies、sparepartssupplies），部署物 4 个（ied、atmine、claymore、fob）。`medical-bag` 对 `medkit`、`oil-rig-hot-zone` 对 `fob` 等名称并非直接同物，需视觉核对，不能先宣称已补齐。压缩包未找到 M12G、AT4、Browning MG、G60、三个 M113 变体、地图或机制条目的同名文件；这些仍可另寻游戏内场景素材。

## 入库条件

1. 明确图片在本站托管/展示的使用许可，或取得独立的官方素材/站长游戏实拍。
2. 对每张图核对物品名称、版本、实际画面及重复图用途；与本站已有记录去重。
3. 逐条通过图片来源清单、页面加载和移动端检查。数字属性不由图片推断。

对应候选名称和功能缺口见 [全目录差距清单](./wardogshub-gap-list-for-owner-2026-09-27.md)。
