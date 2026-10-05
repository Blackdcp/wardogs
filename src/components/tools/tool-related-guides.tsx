import type {Locale} from "@/config/site";
import {buildGuideIndex} from "@/features/guides/guide-index";
import {getGuideDiscoveryLinks} from "@/features/guides/guide-task-data";
import {getToolDefinition} from "@/features/tools/tool-registry";
import {getItemUi} from "@/features/items/item-ui";
import {SectionHeading} from "@/components/ui/section-heading";
import {TaskLink} from "@/components/ui/task-link";

export async function buildToolRelatedLinks(toolId: string, locale: Locale) {
  const tool = getToolDefinition(toolId);
  if (!tool) throw new Error(`Unknown discovery tool: ${toolId}`);
  const bySlug = new Map((await buildGuideIndex(locale)).map((guide) => [guide.slug, guide]));
  const guides = tool.relatedGuideSlugs.map((slug) => {
    const guide = bySlug.get(slug);
    if (!guide) throw new Error(`Missing localized related tool guide: ${locale}/${slug}`);
    return guide;
  });
  const catalogue = [...new Map(tool.relatedGuideSlugs.flatMap((slug) => getGuideDiscoveryLinks(slug, locale).relatedCatalogue).map((link) => [link.href, link])).values()];
  return {tool, guides, catalogue};
}

export type ToolRelatedLinksModel = Awaited<ReturnType<typeof buildToolRelatedLinks>>;
export function ToolRelatedGuidesView({model, locale}: {model: ToolRelatedLinksModel; locale: Locale}) {
  const ui = getItemUi(locale);
  const titleId = `tool-related-${model.tool.id}`;
  return (
    <nav className="mt-10 border-t border-[#344039] pt-7" data-tool-related-guides={model.tool.id} aria-labelledby={titleId}>
      <SectionHeading id={titleId} title={ui.relatedGuides} />
      <ul className="grid gap-2 sm:grid-cols-2">
        {model.guides.map((guide) => <li key={guide.slug}><TaskLink href={`/${locale}/guides/${guide.slug}`} label={guide.title} variant="text" /></li>)}
      </ul>
      {model.catalogue.length ? (
        <div className="mt-5">
          <p className="text-sm font-semibold text-white">{ui.relatedItems}</p>
          <ul className="mt-3 flex flex-wrap gap-3">
            {model.catalogue.map((link) => <li key={link.href}><TaskLink href={`/${link.locale}${link.href}`} label={link.label} /></li>)}
          </ul>
        </div>
      ) : null}
    </nav>
  );
}
export const ToolRelatedGuides = ToolRelatedGuidesView;
