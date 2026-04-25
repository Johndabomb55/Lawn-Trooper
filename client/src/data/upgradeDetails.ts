export interface UpgradeDetail {
  title: string;
  what: string;
  when: string;
  why: string;
}

export const UPGRADE_DETAILS: Record<string, UpgradeDetail> = {
  shrub_hedge_trimming: {
    title: "Shrub / Hedge Trimming",
    what: "One-time trimming service for up to 20 small to medium bushes or hedges. Includes shaping and proper disposal of all clippings.",
    when: "Scheduled during the growing season when plants are actively producing new growth, typically spring through early fall.",
    why: "Keeps your property looking neat and well-maintained, improves curb appeal, and promotes healthier plant growth."
  },
  basic_pressure_wash: {
    title: "Standard Pressure-Wash Package",
    what: "Light exterior pressure washing of your porch, sidewalk, and mailbox area to refresh high-visibility surfaces.",
    when: "Typically performed in spring or early summer to clear winter buildup, or as needed before events or gatherings.",
    why: "Maintains a clean, welcoming entrance and prevents long-term staining from mold, mildew, and dirt buildup."
  },
  driveway_pressure_wash_basic: {
    title: "Driveway Pressure Wash",
    what: "Targeted pressure washing to clean and brighten driveway surfaces, removing built-up grime and stains.",
    when: "Best scheduled in spring or fall when weather allows for proper cleaning and drying.",
    why: "Improves curb appeal instantly and prevents oil, mold, and algae from degrading your driveway surface over time."
  },
  overseeding: {
    title: "Overseeding",
    what: "Professional overseeding to improve lawn density and encourage healthier, thicker grass growth across thin or patchy areas.",
    when: "Best performed in early fall for cool-season grasses or late spring for warm-season grasses when soil temperatures are optimal.",
    why: "Fills in bare spots, chokes out weeds naturally, and creates a thicker, more resilient lawn over time."
  },
  mulch_install_4yards: {
    title: "Seasonal Mulch Refresh",
    what: "Mulch installation for defined garden or bed areas. Includes brown, red, black hardwood or pine bark mulch with delivery and installation.",
    when: "Typically installed in spring to refresh beds for the growing season, or in fall to protect root systems over winter.",
    why: "Refreshes landscape appearance, retains soil moisture, regulates soil temperature, and suppresses weed growth in beds."
  },
  quarterly_trash_bin_cleaning: {
    title: "Every-Other-Month Trash Can Wash",
    what: "Deep wash service for outdoor trash and recycling bins to remove residue, bacteria, and odor-causing buildup.",
    when: "Performed every other month to keep bins cleaner through changing seasons, especially during hotter months.",
    why: "Reduces foul odors, discourages pests, and keeps your curbside bins sanitary and presentable."
  },
  christmas_lights_basic: {
    title: "Standard Seasonal Lighting",
    what: "Ground-level seasonal lighting focused on shrubs, small trees, and select landscape areas using simple yard pop-up lighting.",
    when: "Installed in late November before the holiday season and removed in early January. Layout discussed with homeowner.",
    why: "Adds festive curb appeal during the holidays without the hassle and safety risk of DIY installation."
  },
  growing_season_boost: {
    title: "Reserve Your Rapid-Response Weekly Cuts (Standard Plan)",
    what: "Includes 6 weekly mowings you can deploy whenever needed, so you choose exactly which weeks get weekly coverage.",
    when: "Use during wet months, heavy growth windows, or before events when you want tighter weekly cadence coverage.",
    why: "Gives you rapid-response coverage during rainy growth spikes and flexible control over exactly when extra weekly service happens."
  },
  extra_weed_control: {
    title: "Additional Weed Control & Fertilization",
    what: "3 additional lawn applications including fertilizer, pre-emergent weed prevention, and targeted weed-killer beyond your plan's base coverage.",
    when: "Applied at strategic intervals throughout the growing season for maximum effectiveness against seasonal weeds.",
    why: "Accelerates your lawn's path to a weed-free, green, healthy state with more frequent professional treatments."
  },
  pine_straw_basic: {
    title: "Standard Pine Straw Install (Up to 10 Big Bales)",
    what: "Pine straw installation for smaller garden beds and landscape areas. Includes up to 10 big bales of quality pine straw with delivery and professional installation.",
    when: "Typically installed in early spring or late fall to refresh beds and provide seasonal ground cover.",
    why: "Pine straw is a natural, attractive ground cover that retains moisture, insulates roots, and gives beds a clean, uniform look."
  },
  pine_straw_and_rock_beds: {
    title: "Pine Straw & Decorative Rock Beds",
    what: "Pine straw plus decorative landscape rock for beds and tree rings. All materials, delivery, and installation are bundled — you are not charged separately for product on top of labor.",
    when: "Best after bed edges are defined; often paired with spring or fall refresh visits.",
    why: "Rock and pine straw together control weeds, improve drainage in problem spots, and give beds a finished, high-contrast look with one clear price."
  },
  gutter_cleaning: {
    title: "Gutter Cleaning",
    what: "Thorough cleaning of gutters and downspouts to remove leaves, debris, and blockages that prevent proper drainage.",
    when: "Best performed in late fall after leaves drop and again in spring to clear winter debris. Twice-yearly service recommended.",
    why: "Prevents water damage to your home's foundation, walls, and landscaping by ensuring gutters drain properly."
  },
  one_time_leaf_removal: {
    title: "One-Time Leaf Removal",
    what: "Single-visit leaf removal service including blowing, raking, and hauling away all leaves from your property.",
    when: "Scheduled in late fall or early winter after the majority of leaves have fallen from deciduous trees.",
    why: "Removes heavy leaf coverage that can smother your lawn, harbor pests, and create a messy appearance during fall and winter."
  },
  weekly_growth_season_mowing: {
    title: "Weekly Bagging Service",
    what: "Premium weekly mowing cadence with grass bagging and removal for a cleaner finish and reduced clippings left on turf.",
    when: "Best during wet months and fast-growth periods when lawns need tighter timing and more cleanup after each cut.",
    why: "Keeps your lawn neat and consistently clean when growth spikes, with bagging support that improves appearance between visits."
  },
  premium_pressure_wash: {
    title: "Premium Pressure-Wash Package",
    what: "Comprehensive exterior pressure washing covering driveway, porch, sidewalk, mailbox, and additional exterior surfaces.",
    when: "Scheduled annually, typically in spring or before special occasions for maximum visual impact.",
    why: "Provides a complete exterior refresh that dramatically improves your home's curb appeal and prevents long-term surface damage."
  },
  house_soft_wash: {
    title: "House Soft Wash",
    what: "Low-pressure soft washing to safely clean exterior siding and surfaces, removing mold, mildew, and algae without damaging your home's finish.",
    when: "Best performed in spring or early summer. Can be repeated annually to maintain a clean exterior appearance.",
    why: "Restores your home's exterior appearance safely, extends the life of siding and paint, and removes harmful organic growth."
  },
  mulch_install_10yards: {
    title: "Premium Mulch Install (Up to 10 Yards)",
    what: "Expanded mulch installation with increased coverage and attention to detail for larger bed areas. Mulch, delivery, and installation included.",
    when: "Typically installed in spring to refresh beds for the growing season, or in fall for winter root protection.",
    why: "Provides enhanced curb appeal across larger landscape areas while retaining moisture and suppressing weeds throughout your property."
  },
  monthly_trash_bin_cleaning: {
    title: "Monthly Trash Can Wash (+ 2nd Can Free)",
    what: "Monthly deep wash service for outdoor trash and recycling bins to maintain consistent freshness and sanitation, with your second can included at no extra charge.",
    when: "Performed once per month, every month, for year-round bin hygiene and odor control.",
    why: "More frequent cleaning keeps bins consistently fresh, reduces pest attraction, and eliminates persistent odors especially in warmer months."
  },
  christmas_lights_premium: {
    title: "Premium Seasonal Lighting",
    what: "Expanded seasonal lighting including roofline lighting, enhanced landscape features, and decorative yard elements.",
    when: "Installed in late November and removed in early January. Full design consultation with homeowner included.",
    why: "Creates a stunning holiday display that transforms your property into a neighborhood standout without the risk of climbing ladders."
  },
  pine_straw_premium: {
    title: "Premium Pine Straw Install (Up to 25 Big Bales)",
    what: "Expanded pine straw installation for larger properties. Includes up to 25 big bales of premium pine straw with delivery and professional installation.",
    when: "Installed in early spring or late fall, with attention to detail for comprehensive bed coverage across your entire property.",
    why: "Provides complete, uniform ground cover for larger landscapes, maximizing moisture retention and weed suppression across all beds."
  },
  aeration_dethatching: {
    title: "Aeration & Dethatching",
    what: "Professional lawn aeration and dethatching to break up compacted soil and remove excess thatch buildup from your lawn.",
    when: "Best performed in early fall for cool-season grasses or late spring for warm-season grasses when recovery is fastest.",
    why: "Improves water absorption, air circulation, and root development — essential for revitalizing compacted or stressed lawns."
  },
  tree_trimming: {
    title: "Tree Trimming (Small to Medium Trees)",
    what: "Professional trimming of small to medium trees to improve shape, remove dead branches, and promote healthy growth. Does not include large tree removal.",
    when: "Best scheduled during dormancy (late winter) or after spring growth flush. Avoid heavy pruning during active growth periods.",
    why: "Maintains tree health and appearance, removes hazardous dead branches, and allows more light to reach your lawn and landscape beds."
  },
  full_yard_cleanout: {
    title: "Full Yard Cleanout",
    what: "Complete yard cleanup including debris removal, bed edging, pruning, and general tidying of your entire property.",
    when: "Ideal in early spring to prepare for the growing season or in late fall to clean up before winter.",
    why: "Gets your property back in shape quickly after seasonal buildup or neglect, providing a fresh start for ongoing maintenance."
  }
};

export const getUpgradeDetail = (upgradeId: string): UpgradeDetail | undefined => {
  return UPGRADE_DETAILS[upgradeId];
};
