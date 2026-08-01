/* ==========================================================================
   Data: quick-check items, energy/pre-workout matrix, glossary, evidence.
   Source: "What Breaks a Fast? A Reference Guide" — formulations verified
   against manufacturer labels, July 2026. Formulations change over time.
   ========================================================================== */

const ITEMS = [
  // ---------------------------------------------------------------- Beverages
  {
    id: "water",
    name: "Water & ice",
    examples: "—",
    category: "beverage",
    symbol: "pass",
    religious: true,
    summary: "No calories, no insulin response — the only universally neutral item.",
    detail: "No calories, no insulin response. The only universally neutral item under metabolic definitions. Still breaks most complete religious fasts (Ramadan, Yom Kippur, LDS)."
  },
  {
    id: "sparkling-water",
    name: "Sparkling water",
    examples: "LaCroix, Topo Chico, Perrier",
    category: "beverage",
    symbol: "pass",
    religious: true,
    summary: "Carbonation is just CO₂ — unsweetened versions are metabolically equivalent to water.",
    detail: "Carbonation is dissolved CO₂. Unsweetened versions are metabolically equivalent to water. Some contain “natural flavors” — calorie-free, but excluded under strict clean-fast definitions."
  },
  {
    id: "black-coffee",
    name: "Black coffee",
    examples: "Brewed or instant",
    category: "beverage",
    symbol: "pass",
    religious: true,
    summary: "Roughly 2–5 calories per cup. Caffeine modestly increases fat mobilization.",
    detail: "Roughly 2–5 calories per cup. Caffeine modestly increases fat mobilization and metabolic rate. Note the conflict: many labs require water only before bloodwork, though coffee is an approved pre-surgical clear liquid."
  },
  {
    id: "plain-tea",
    name: "Plain tea",
    examples: "Black, green, oolong, white, herbal",
    category: "beverage",
    symbol: "pass",
    religious: true,
    summary: "Calorie-free. Green tea catechins are linked to modest increases in fat oxidation.",
    detail: "Calorie-free. Green tea catechins are associated with modest increases in fat oxidation. Additions (milk, honey, sugar) change the answer."
  },
  {
    id: "yerba-mate",
    name: "Yerba mate, brewed",
    examples: "Loose leaf or bagged",
    category: "beverage",
    symbol: "pass",
    religious: false,
    summary: "Plain brewed mate is calorie-free. Canned mate is a different product.",
    detail: "Plain brewed mate is calorie-free. Canned mate is a different product — most contain sugar or juice."
  },
  {
    id: "acv",
    name: "Apple cider vinegar",
    examples: "Bragg and equivalents",
    category: "beverage",
    symbol: "pass",
    religious: false,
    summary: "~3 calories per tablespoon. May modestly blunt post-meal glucose response.",
    detail: "About 3 calories per tablespoon. May modestly blunt post-meal glucose response. Undiluted vinegar erodes tooth enamel and irritates the esophagus; dilution in water is standard practice."
  },
  {
    id: "plain-electrolytes",
    name: "Plain electrolytes",
    examples: "Sodium, potassium, magnesium",
    category: "beverage",
    symbol: "pass",
    religious: false,
    summary: "No calories, no insulin response. Helps prevent fasting headache and fatigue.",
    detail: "No calories, no insulin response. Sodium loss is a recognized contributor to headache and fatigue during longer fasts."
  },
  {
    id: "diet-soda",
    name: "Diet soda",
    examples: "Coke Zero, Diet Coke",
    category: "beverage",
    symbol: "warn",
    religious: false,
    summary: "Fat-loss: fine. Clean fast: breaks it — sweet taste is the excluded thing.",
    detail: "Fat-loss definition: does not break it — no calories, no meaningful insulin response in most people. Clean fast: breaks it; sweet taste is the specific thing excluded. Autophagy: no amino acids, so generally outside the definition."
  },
  {
    id: "flavored-electrolytes",
    name: "Flavored electrolytes",
    examples: "LMNT, Nuun, Liquid I.V.",
    category: "beverage",
    symbol: "warn",
    religious: false,
    summary: "Not interchangeable — LMNT is calorie-free, Liquid I.V. has ~11g sugar.",
    detail: "Not interchangeable products. LMNT: no calories, stevia-sweetened. Nuun: approximately 1g carbohydrate. Liquid I.V.: approximately 11g sugar, which breaks a fast under every metabolic definition. Unflavored electrolytes avoid the ambiguity."
  },
  {
    id: "sweeteners",
    name: "Non-caloric sweeteners",
    examples: "Sucralose, stevia, monk fruit, aspartame, erythritol",
    category: "beverage",
    symbol: "warn",
    religious: false,
    summary: "No meaningful insulin response alone. Breaks a clean fast on taste alone.",
    detail: "Controlled trials show no meaningful insulin response from these compounds alone. Fat-loss definition: outside it. Clean fast: breaks it. A separate consideration is behavioral — sweet taste is associated with increased craving for some people. Some packets contain maltodextrin or dextrose as bulking agents, which are carbohydrates."
  },
  {
    id: "fat-coffee",
    name: "Coffee with fat added",
    examples: "Butter, MCT oil, coconut oil",
    category: "beverage",
    symbol: "warn",
    religious: false,
    summary: "200–400 calories, minimal insulin response — but breaks autophagy and caloric fasts.",
    detail: "Roughly 200–400 calories with minimal insulin response. Ketogenic fat-loss definitions: often treated as permitted. Any caloric-restriction definition: breaks it. Autophagy: breaks it — calories suppress autophagy independent of protein."
  },
  {
    id: "kombucha",
    name: "Kombucha",
    examples: "GT's, Health-Ade",
    category: "beverage",
    symbol: "warn",
    religious: false,
    summary: "20–60 calories, 2–8g sugar per serving. Breaks most definitions.",
    detail: "Typically 20–60 calories and 2–8g sugar per serving. Breaks a fast under most definitions; small volumes fall within some looser fat-loss definitions."
  },
  {
    id: "bone-broth",
    name: "Bone broth",
    examples: "Packaged or homemade",
    category: "beverage",
    symbol: "warn",
    religious: true,
    summary: "30–50 cal, 6–10g protein per cup. The verdict genuinely flips by lane.",
    detail: "Roughly 30–50 calories and 6–10g protein per cup, which breaks autophagy and clean-fast definitions. It is explicitly permitted on many gut-rest protocols, medical clear-liquid diets, and fasting-mimicking approaches. The verdict genuinely inverts by lane."
  },
  {
    id: "coconut-water",
    name: "Coconut water",
    examples: "Vita Coco, Harmless Harvest",
    category: "beverage",
    symbol: "fail",
    religious: false,
    summary: "45–60 calories, 9–12g sugar per cup — comparable to fruit juice.",
    detail: "45–60 calories and 9–12g sugar per cup. Nutritionally comparable to fruit juice."
  },
  {
    id: "juice",
    name: "Juice",
    examples: "Any, including fresh-pressed",
    category: "beverage",
    symbol: "fail",
    religious: false,
    summary: "Concentrated sugar without fiber. Rapid insulin response.",
    detail: "Concentrated fructose and glucose without fiber. Rapid insulin response. Pulp-free juice is an approved pre-surgical clear liquid — the sole lane where it passes."
  },
  {
    id: "milk-cream",
    name: "Milk & cream, any quantity",
    examples: "Dairy and plant milks",
    category: "beverage",
    symbol: "fail",
    religious: false,
    summary: "Protein activates mTOR and suppresses autophagy, even in small amounts.",
    detail: "Protein content activates mTOR and suppresses autophagy. A tablespoon of cream is roughly 50 calories and 0.4g protein — enough to register."
  },
  {
    id: "alcohol",
    name: "Alcohol",
    examples: "Beer, wine, spirits, seltzers",
    category: "beverage",
    symbol: "fail",
    religious: true,
    summary: "7 cal/g. Ethanol metabolism halts fat oxidation; empty-stomach hypoglycemia risk.",
    detail: "7 calories per gram. Ethanol metabolism takes hepatic priority, halting fat oxidation. Alcohol on an empty stomach also carries hypoglycemia risk."
  },
  {
    id: "protein-drinks",
    name: "Protein & amino acid drinks",
    examples: "Whey, casein, BCAA, EAA, collagen",
    category: "beverage",
    symbol: "fail",
    religious: false,
    summary: "The most direct fast-breaker — amino acids terminate the fasted state.",
    detail: "The most direct fast-breaker. Amino acids are the specific signal that terminates the fasted state, regardless of calorie count."
  },

  // -------------------------------------------------------- Foods & additives
  {
    id: "citrus-wedge",
    name: "Citrus wedge",
    examples: "Lemon, lime",
    category: "food",
    symbol: "pass",
    religious: false,
    summary: "~1 calorie per wedge. No measurable metabolic effect.",
    detail: "Roughly 1 calorie per wedge. No measurable metabolic effect. Lemonade and bottled juice are different products."
  },
  {
    id: "spices",
    name: "Plain spices, trace",
    examples: "Cinnamon, pepper, turmeric",
    category: "food",
    symbol: "pass",
    religious: false,
    summary: "A dash carries negligible calories; cinnamon may modestly aid insulin sensitivity.",
    detail: "A dash carries negligible calories. Cinnamon is associated with modest improvements in insulin sensitivity."
  },
  {
    id: "toothpaste",
    name: "Toothpaste & mouthwash",
    examples: "Any",
    category: "food",
    symbol: "pass",
    religious: true,
    summary: "Not swallowed, metabolically irrelevant — but breaks several religious fasts.",
    detail: "Not swallowed, metabolically irrelevant. Breaks a religious fast in several traditions — many observant Muslims avoid toothpaste during daylight hours in Ramadan."
  },
  {
    id: "medication",
    name: "Prescription medication",
    examples: "—",
    category: "food",
    symbol: "pass",
    religious: false,
    summary: "Should never be stopped or delayed to preserve a fast.",
    detail: "Prescribed medication should not be stopped or delayed to preserve a fast. Timing is a question for the prescribing clinician. Some medications require food; some fasting protocols interact with insulin, sulfonylureas, and blood pressure medication."
  },
  {
    id: "gum",
    name: "Chewing gum, sugar-free",
    examples: "Extra, Trident, Orbit",
    category: "food",
    symbol: "warn",
    religious: true,
    summary: "Evidence is mixed — likely fine for fat loss, excluded before lab work.",
    detail: "Evidence is mixed. Controlled trials in fasted adults found no significant change in glucose or insulin after 30 minutes of chewing. A clinical laboratory study found measurable shifts in cortisol, insulin, C-peptide, and triglycerides — which is why standard lab guidance excludes gum before a blood draw. Practical reading: outside a fat-loss definition, excluded before lab work, breaks a clean fast."
  },
  {
    id: "mints",
    name: "Breath mints",
    examples: "Tic Tac, Altoids, Ice Breakers",
    category: "food",
    symbol: "warn",
    religious: true,
    summary: "1–5 calories per mint — below the fat-loss threshold, but breaks a clean fast.",
    detail: "Roughly 1–5 calories per mint — below the threshold that meaningfully affects fat loss or insulin. A standard Tic Tac is largely sugar but small enough to be labeled 0g. Breaks clean and religious fasts; unlikely to affect a fat-loss definition."
  },
  {
    id: "gelatin-capsules",
    name: "Gelatin capsules",
    examples: "Softgels, supplement capsules",
    category: "food",
    symbol: "warn",
    religious: false,
    summary: "Trace protein, a few calories at most — immaterial to fat loss.",
    detail: "Trace protein, a few calories at most. Immaterial to fat loss. Tablets and vegetable capsules avoid the question entirely."
  },
  {
    id: "fiber",
    name: "Fiber supplements",
    examples: "Psyllium husk, methylcellulose",
    category: "food",
    symbol: "warn",
    religious: false,
    summary: "Minimal calories or insulin effect, but real digestive workload — breaks gut rest.",
    detail: "Minimal digestible calories and little insulin response, but meaningful digestive workload — which breaks a gut-rest definition while remaining roughly neutral for fat loss."
  },
  {
    id: "leafy-greens",
    name: "Leafy greens",
    examples: "Spinach, lettuce, arugula",
    category: "food",
    symbol: "fail",
    religious: false,
    summary: "Low calorie, but still food. Chewing and digestion end the fasted state.",
    detail: "Low calorie, but food. Chewing, swallowing, and digestion end the fasted state under every definition."
  },
  {
    id: "seaweed",
    name: "Seaweed snacks",
    examples: "Roasted, salted varieties",
    category: "food",
    symbol: "fail",
    religious: false,
    summary: "Prepared with oil and salt — enough fat and fiber to initiate digestion.",
    detail: "Prepared with oil and salt. Small servings still carry fat and fiber sufficient to initiate digestion."
  },
  {
    id: "rice-paper",
    name: "Rice paper",
    examples: "Spring roll wrappers",
    category: "food",
    symbol: "fail",
    religious: false,
    summary: "Refined starch. Rapid glucose and insulin response.",
    detail: "Refined starch. Rapid glucose and insulin response."
  },
  {
    id: "fruit",
    name: "Fruit",
    examples: "Whole or dried",
    category: "food",
    symbol: "fail",
    religious: false,
    summary: "Natural sugar is still metabolically sugar; fiber slows, doesn't eliminate it.",
    detail: "Natural sugar is metabolically sugar. Fiber slows absorption without eliminating it."
  },
  {
    id: "gummy-vitamins",
    name: "Gummy vitamins",
    examples: "Any",
    category: "food",
    symbol: "fail",
    religious: false,
    summary: "Built on a glucose or cane-sugar base. Tablets deliver the same nutrients sugar-free.",
    detail: "Glucose syrup, corn syrup, or cane sugar base. Tablets and capsules deliver the same micronutrients without the sugar."
  }
];

/* Energy drink / pre-workout product-type matrix (verdicts by definition) */
const ENERGY_MATRIX = [
  {
    type: "Zero-sugar energy drink",
    fatLoss: { symbol: "pass", note: "0–15 calories" },
    autophagy: { symbol: "warn", note: "Usually outside it — taurine/amino blends are the exception" },
    cleanFast: { symbol: "fail", note: "Sweeteners and flavor exclude it" }
  },
  {
    type: "Stimulant-only pre-workout",
    fatLoss: { symbol: "pass", note: "Negligible calories" },
    autophagy: { symbol: "fail", note: "Beta-alanine, citrulline, and arginine are amino acids" },
    cleanFast: { symbol: "fail", note: "Flavored and sweetened" }
  },
  {
    type: "Amino or EAA pre-workout",
    fatLoss: { symbol: "pass", note: "On calories alone" },
    autophagy: { symbol: "fail", note: "Decisively — this is the direct mTOR trigger" },
    cleanFast: { symbol: "fail", note: "Flavored, sweetened, and full of aminos" }
  },
  {
    type: "Carbohydrate-loaded pre-workout",
    fatLoss: { symbol: "fail", note: "Meaningful sugar/dextrose load" },
    autophagy: { symbol: "fail", note: "Calories and aminos both present" },
    cleanFast: { symbol: "fail", note: "Fails on every count" }
  },
  {
    type: "Plain caffeine tablet",
    fatLoss: { symbol: "pass", note: "No calories" },
    autophagy: { symbol: "pass", note: "No amino acids, no mTOR activation" },
    cleanFast: { symbol: "pass", note: "No flavor, no sweetener" }
  }
];

/* Glossary — terms decoded */
const GLOSSARY = [
  {
    term: "Beta-alanine",
    body: "An amino acid that buffers acid accumulation in muscle, extending endurance. It's responsible for the tingling, prickling sensation across the face and neck that arrives about fifteen minutes in — that sensation is <em>paresthesia</em>. It's harmless, temporary, and not an allergic reaction. Being an amino acid, it breaks an autophagy fast."
  },
  {
    term: "L-citrulline / L-arginine",
    body: "Amino acids that raise nitric oxide and widen blood vessels, producing the “pump.” Same verdict as beta-alanine, same reason: they're amino acids."
  },
  {
    term: "Creatine monohydrate",
    body: "Not a protein-building amino acid and not a meaningful insulin trigger. Plain unflavored creatine monohydrate is widely treated as neutral across metabolic definitions. Creatine nitrate and flavored blends carry other ingredients that may not be."
  },
  {
    term: "Taurine",
    body: "An amino acid, though not one used in protein synthesis, and a weak mTOR activator. Genuinely ambiguous — excluded under strict definitions."
  },
  {
    term: "mTOR",
    body: "The body's growth switch (mechanistic target of rapamycin). Amino acids activate it. Fasting deactivates it. Autophagy runs only while it's off."
  },
  {
    term: "Autophagy",
    body: "Literally “self-eating.” Cells break down damaged components and recycle the materials. The process increases during nutrient scarcity, which is the principal reason people undertake longer fasts."
  }
];

/* Evidence entries */
const EVIDENCE = [
  {
    title: "Coffee and autophagy",
    body: "The frequently cited study is Pietrocola et al., “Coffee induces autophagy in vivo,” <em>Cell Cycle</em>, 2014, which found increased autophagic flux in liver, muscle, and heart tissue within 1–4 hours, alongside mTORC1 inhibition. Two qualifications rarely accompany the citation: the study was conducted in mice — human data remains limited — and decaffeinated coffee produced the same effect, meaning caffeine is not the active compound; the authors attribute the result to polyphenols. The supportable claim is that coffee appears not to interfere with a fast, with promising animal evidence suggesting benefit — not that it triggers autophagy in a given human on a given morning."
  },
  {
    title: "Amino acids and mTOR",
    body: "Well established. Leucine and other branched-chain amino acids activate mTORC1, which suppresses autophagy. The cell and animal biology is replicated and forms the mechanistic basis for the protein rule. The honest qualification: precise dose and duration thresholds in living humans are not established. “One gram of BCAA immediately terminates autophagy” is a reasonable inference rather than a measured human finding. The direction is certain; the threshold isn't."
  },
  {
    title: "Chewing gum",
    body: "Genuinely mixed. A controlled trial in fasted healthy men found no significant differences in glucose, insulin, or GIP following sugar-free gum. A separate clinical laboratory study of 22 volunteers found significant shifts in cortisol, insulin, C-peptide, triglycerides, and amylase — the basis for standard guidance excluding gum before blood draws. The reconciliation: gum produces small, measurable, short-lived changes — sufficient to compromise a blood test, likely insufficient to affect fat loss."
  },
  {
    title: "Non-caloric sweeteners",
    body: "The common claim that sweeteners cause insulin resistance is not supported at the confidence level it's usually stated. Established: sucralose, aspartame, and stevia produce no meaningful insulin or glucose response independently, including in people with type 2 diabetes. Contested: whether long-term use alters gut microbiota in ways affecting glucose tolerance. Research exists — notably Suez et al., <em>Nature</em>, 2014, and subsequent work — but findings are inconsistent and effects vary substantially between individuals. This is an open question rather than a settled finding."
  },
  {
    title: "Preoperative fasting",
    body: "The 2-hour clear-liquid window is formal clinical guidance endorsed by both American and European anesthesiology bodies. Standard guidance for healthy adults undergoing elective procedures: clear liquids (water, black coffee, black tea, pulp-free juice) — 2 hours; light meal — 6 hours; fatty or heavy meal — 8 hours; non-human milk — 6 hours. The variable being managed is aspiration risk under anesthesia, not insulin."
  }
];
