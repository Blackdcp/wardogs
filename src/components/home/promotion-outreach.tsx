import {ArrowRight, MessageCircle, Send} from "lucide-react";
import {Link} from "@/i18n/navigation";

const todayActions = [
  {
    title: "Day-1 Growth Plan",
    items: [
      "Publish 1 high-intent guide update (PS5 or Beta/Alpha page) and refresh updatedAt.",
      "Add 1 comment under 2 official/community videos with one internal link to your guide.",
      "Submit 5 URLs in Search Console Indexing for the highest intent pages."
    ]
  },
  {
    title: "Top-Links to Push",
    items: [
      "/guides/wardogs-playtest",
      "/guides/wardogs-release-date",
      "/guides/wardogs-early-access",
      "/guides/wardogs-beta",
      "/guides/wardogs-ps5",
      "/guides/wardogs-steam"
    ]
  }
];

const commentTemplates = [
  "🔍 Quick guide: Wardogs alpha/early access dates + Steam entry path summary. If you're checking right now, start at the PS5 status and then jump to playtest rules: /guides/wardogs-ps5 + /guides/wardogs-playtest",
  "Wardogs players asked this: is it true 100-player/3-team? We kept this in one page with confirmed + unconfirmed facts only. Check latest: /guides/wardogs-gameplay + /news",
  "If you want a practical start, these two pages are enough for first-time users: /guides/wardogs-playtest and /guides/wardogs-gameplay with current playtest notes."
];

export function PromotionOutreach() {
  return (
    <section aria-labelledby="promotion-outreach-title" className="border-b border-[#26312c] bg-[#101613] py-16 sm:py-20">
      <div className="site-container">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#d9a93a]">Growth Workbench</p>
        <h2 id="promotion-outreach-title" className="display-font mt-3 text-3xl leading-tight text-[#f2f5f3] sm:text-4xl">
          Promotion Action Center
        </h2>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-[#a8b4ae] sm:text-base">
          Use these blocks today for SEO and community reach. Keep to these links first; update after one round of traffic check.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="space-y-6 rounded-[12px] border border-[#2d4036] bg-[#151b18] p-6">
            <div className="flex items-center gap-3">
              <Send aria-hidden="true" className="size-5 text-[#79d19c]" />
              <h3 className="display-font text-2xl text-[#f2f5f3]">Today&apos;s priority</h3>
            </div>
            {todayActions.map((section) => (
              <div className="border-t border-[#2a3530] pt-5" key={section.title}>
                <h4 className="text-sm font-semibold uppercase tracking-[0.12em] text-[#79a9d1]">{section.title}</h4>
                <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-[#c4d0ca]">
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="mt-4">
              <Link className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#79d19c] hover:text-[#a0e0ba]" href="/guides">
                Continue to all guides <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </div>
          </div>

          <div className="space-y-6 rounded-[12px] border border-[#2d4036] bg-[#151b18] p-6">
            <div className="flex items-center gap-3">
              <MessageCircle aria-hidden="true" className="size-5 text-[#79d19c]" />
              <h3 className="display-font text-2xl text-[#f2f5f3]">Comment Templates</h3>
            </div>
            <div className="space-y-4">
              {commentTemplates.map((template) => (
                <article className="rounded-[8px] border border-[#2d3734] bg-[#121816] p-4" key={template.slice(0, 42)}>
                  <p className="text-sm leading-7 text-[#c4d0ca]">{template}</p>
                </article>
              ))}
            </div>
            <p className="text-xs leading-6 text-[#83908a]">
              Tip: copy 1 template to a video comment, keep link density low (1 internal link per comment), then rotate the anchor pages tomorrow.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
