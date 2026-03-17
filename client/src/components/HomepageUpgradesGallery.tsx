import { useState } from "react";
import { getHomepageFeaturedAddons } from "@/data/plans";
import { getUpgradeDetail } from "@/data/upgradeDetails";
import imgShrubCare from "@assets/alabama-shrub-care-commercial-tools.jpg";
import imgMulch from "@assets/mulch-brown-refresh-alabama.jpg";
import imgFlowers from "@assets/stock_images/colorful_seasonal_fl_f56cde03.jpg";
import imgTrashCanWash from "@assets/stock_images/residential_garbage__c1c3e341.jpg";
import imgCleanLawn from "@assets/generated_images/manicured_lawn_with_mower_stripes.png";
import imgTreeYard from "@assets/generated_images/manicured_garden_huntsville.png";
import imgPineStraw from "@assets/pine-straw-upgrade.jpg";
import imgWeedControl from "@assets/weed-control-fertilizer-upgrade.png";

const IMAGE_BY_UPGRADE_ID: Record<string, string> = {
  shrub_hedge_trimming: imgShrubCare,
  mulch_install_4yards: imgMulch,
  extra_weed_control: imgWeedControl,
  seasonal_color_flowers: imgFlowers,
  mid_size_tree_trimming_basic: imgTreeYard,
  growing_season_boost: imgCleanLawn,
  quarterly_trash_bin_cleaning: imgTrashCanWash,
  pine_straw_basic: imgPineStraw,
};

const firstSentence = (value: string): string => {
  const trimmed = value.trim();
  if (!trimmed) return "";
  const [sentence] = trimmed.split(". ");
  return sentence.endsWith(".") ? sentence : `${sentence}.`;
};

const tierLabel = (tier: "basic" | "premium") => (tier === "basic" ? "Standard" : "Premium");

export default function HomepageUpgradesGallery() {
  const featured = getHomepageFeaturedAddons();
  const [openCardId, setOpenCardId] = useState<string | null>(featured[0]?.id ?? null);

  return (
    <section className="mt-12 rounded-2xl border border-primary/20 bg-white/70 p-6">
      <h3 className="text-center text-2xl font-heading font-bold text-primary">Featured Upgrades</h3>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        Hover on desktop or tap on mobile to preview each upgrade. Names and descriptions match the same upgrade catalog used in your plan builder.
      </p>
      <p className="mt-2 text-center text-xs text-muted-foreground">
        Need specifics on any upgrade? Ask your account manager during the walkthrough and we will tailor recommendations to your property conditions and goals.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {featured.map((addon) => {
          const detail = getUpgradeDetail(addon.id);
          const summary = firstSentence(detail?.what || addon.description);
          const isOpen = openCardId === addon.id;
          const image = IMAGE_BY_UPGRADE_ID[addon.id] || imgCleanLawn;

          return (
            <article key={addon.id} className="group overflow-hidden rounded-xl border border-border bg-card shadow-sm">
              <div className="relative">
                <img
                  src={image}
                  alt={addon.name}
                  className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                <span className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                  addon.tier === "premium"
                    ? "border border-fuchsia-200 bg-fuchsia-100 text-fuchsia-700"
                    : "bg-green-100 text-green-700"
                }`}>
                  {tierLabel(addon.tier)}
                </span>
                <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden bg-gradient-to-t from-black/75 via-black/45 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100 md:block">
                  <p className="text-xs leading-relaxed text-white">{summary}</p>
                </div>
              </div>

              <div className="p-3">
                <p className="text-sm font-semibold text-primary">{addon.name}</p>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpenCardId(isOpen ? null : addon.id)}
                  className="mt-2 text-xs font-bold text-primary underline underline-offset-2 md:hidden"
                >
                  {isOpen ? "Hide details" : "View details"}
                </button>
                <div className={`overflow-hidden transition-all duration-300 md:hidden ${isOpen ? "mt-2 max-h-24" : "max-h-0"}`}>
                  <p className="text-xs leading-relaxed text-muted-foreground">{summary}</p>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
