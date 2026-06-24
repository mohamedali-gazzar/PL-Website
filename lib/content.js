// ─────────────────────────────────────────────────────────────────────────
// SINGLE SOURCE OF TRUTH — every string/stat/asset here is real Powerline
// content extracted from https://powerlinei.com. Nothing invented.
// ─────────────────────────────────────────────────────────────────────────

export const brand = {
  name: "Powerline",
  tagline: "Powering Progress with Precision",
  mission:
    "Powerline is a leading provider of electrical solutions, committed to quality, innovation, and long-term impact across the region.",
  phone: "+20226215022",
  phoneDisplay: "+20 2 2621 5022",
  facebook: "https://www.facebook.com/Powerline.ABB",
  linkedin:
    "https://www.linkedin.com/company/powerline-egypt/?viewAsMember=true",
  copyright: "© 2026 — Powerline group",
};

// Email that all form submissions are forwarded to.
export const formEmail = "nadagamalahmed2@gmail.com";

// `nav` is defined at the bottom of this file so its product sub-menus can be
// derived from the collections (lowVoltage / mediumVoltage) defined below.

export const heroStats = [
  { value: 2012, suffix: "", label: "Founded in", plain: true },
  { value: 6300, suffix: "A", label: "LV boards up to" },
  { value: 120, suffix: "KA", label: "Short circuit up to" },
  { value: 24, suffix: "kV", label: "MV switchgear up to" },
];

export const projects = [
  { name: "Al Mehwar Hospital", type: "Healthcare Infrastructure", img: "/img/proj-almehwar.webp" },
  { name: "Sodic Vilette", type: "Residential Development", img: "/img/proj-sodic-vilette.webp" },
  { name: "Acrow Formwork Technology", type: "Industrial Manufacturing", img: "/img/proj-acrow.webp" },
  { name: "Sodic June", type: "Mixed-Use Development", img: "/img/proj-sodic-june.webp" },
  { name: "Mountain View", type: "Residential Development", img: "/img/proj-mountain-view.webp" },
  { name: "Zed Park", type: "Urban Development", img: "/img/proj-zed-park.webp" },
];

export const productLines = [
  {
    key: "lv",
    title: "Low Voltage",
    href: "/low-voltage",
    img: "/img/line-lv.webp",
    blurb:
      "Certified ABB panel builder. Fully type-tested low voltage boards up to 6300A and short circuit up to 120KA — compliant with IEC 61439-1/2/3 and ABB guidelines.",
    specs: [
      { value: 6300, suffix: "A", label: "Rated current" },
      { value: 120, suffix: "KA", label: "Short circuit" },
    ],
  },
  {
    key: "mv",
    title: "Medium Voltage",
    href: "/medium-voltage",
    img: "/img/line-mv.webp",
    blurb:
      "Air- and gas-insulated switchgear, ring main units and compact secondary substations up to 24kV — built with global technology partners.",
    specs: [
      { value: 24, suffix: "kV", label: "Voltage class" },
      { value: 2, suffix: "", label: "Advanced facilities" },
    ],
  },
  {
    key: "dry",
    title: "Dry Transformers",
    href: "/products/dry-type-transformers",
    img: "/img/dry-card.webp",
    blurb:
      "Air-cooled dry-type distribution transformers for safe, efficient power in indoor and environmentally sensitive locations — engineered to IEC standards.",
    specs: [
      { value: 3000, suffix: "kVA", label: "Up to" },
      { value: 24, suffix: "kV", label: "Voltage class" },
    ],
  },
  {
    key: "supplies",
    title: "Supplies",
    href: "/supplies",
    img: "/img/line-supplies.webp",
    blurb:
      "High-quality oil-immersed distribution transformers from leading partners like Hitachi Energy and El Sewedy — for indoor and outdoor use.",
    specs: [
      { value: 3000, suffix: "kVA", label: "Up to" },
      { value: 24, suffix: "kV", label: "Voltage class" },
    ],
  },
];

export const milestones = [
  { year: "2012", title: "Kick-off", img: "/img/ms-2012.webp", body: "Founded with a vision for reliable, innovative electrical solutions." },
  { year: "2015", title: "Infrastructure", img: "/img/ms-2015.webp", body: "Expanded capabilities into advanced infrastructure solutions and home automation." },
  { year: "2017", title: "LVP Assembly", img: "/img/ms-2017.webp", body: "Introduced advanced low-voltage panel (LVP) assembly." },
  { year: "2018", title: "Certified Success", img: "/img/ms-2018.webp", body: "Achieved certification of LVP panel building." },
  { year: "2021", title: "Assembly of RMUs", img: "/img/ms-2021.webp", body: "Began assembly of Ring Main Units for power distribution solutions." },
  { year: "2022", title: "CSS Integration", img: "/img/ms-2022.webp", body: "Integration of Compact Secondary Substation (CSS) systems." },
  { year: "2024", title: "Smart RMUs", img: "/img/ms-2024.webp", body: "Introduction of SMART RMUs." },
  { year: "2025", title: "SWG Schneider MCSET 24KV", img: "/img/ms-2025.webp", body: "Assembly of Schneider MCset switchgear rated 24KV." },
  { year: "2026", title: "Dry Type Transformers", img: "/img/prod-dry.webp", body: "Full assembly lines for dry-type transformers." },
];

export const values = [
  { title: "Customer Focus", n: "01", desc: "We design around our clients' needs — from first specification to final commissioning." },
  { title: "Continuous Innovation", n: "02", desc: "We refine our designs, processes and technology with every project we deliver." },
  { title: "Collaboration", n: "03", desc: "We work as one team — with our partners, our clients and each other." },
  { title: "Excellence", n: "04", desc: "We hold every panel to international standards, with no shortcuts." },
  { title: "Ownership", n: "05", desc: "We take responsibility for our work and stand behind every solution." },
];

export const safety = {
  heading: "We never forget about SAFETY",
  body: "At Powerline, safety and quality are our top priorities. We are committed to delivering reliable and high-performance solutions while ensuring the safety of our team and clients. Through rigorous standards and continuous improvement, we uphold the highest levels of quality in every project we undertake.",
  img: "/img/facility-2.webp",
};

export const powerlineEffect = {
  before: "/img/effect-before.webp",
  after: "/img/effect-after.webp",
};

export const memorial = {
  name: "Engineer Hassan El-Sayed",
  img: "/img/memorial.webp",
  body: "In loving memory of Engineer Hassan El-Sayed, whose vision and passion sparked the journey that led to everything we are today. His unwavering dedication and leadership laid the foundation for all that we've built, and his legacy continues to inspire us every day.",
};

export const customers = Array.from({ length: 10 }, (_, i) =>
  i === 1 ? "/img/cust-elsewedy.webp" : `/img/cust-${i + 1}.webp`
);

export const partners = [
  "/img/partner-1.webp",
  "/img/partner-2.webp",
  "/img/partner-3.webp",
];

export const locations = [
  {
    name: "Sales Office",
    address: "20 Ammar Ibn Yasser, Heliopolis, Cairo, Egypt",
    maps: "https://www.google.com/maps/search/?api=1&query=20+Ammar+Ibn+Yasser+Heliopolis+Cairo",
  },
  {
    name: "MV Factory",
    address: "10th of Ramadan, Industrial Area C3, Block 112, Al-Sharqia",
    maps: "https://www.google.com/maps/search/?api=1&query=10th+of+Ramadan+Industrial+Area+C3+Block+112",
  },
  {
    name: "LV & CSS",
    address: "10th of Ramadan, Industrial Area A5, Block 143, Al-Sharqia",
    maps: "https://www.google.com/maps/search/?api=1&query=10th+of+Ramadan+Industrial+Area+A5+Block+143",
  },
];

// Nodes for the "Power Across Egypt" map — x/y on the SVG's 940×820 viewBox,
// placed by real geography on the Egypt outline.
export const powerLocations = [
  { city: "Cairo", role: "Headquarters", x: 478, y: 144, hq: true },
  { city: "Giza", role: "Manufacturing", x: 460, y: 152 },
  { city: "Alexandria", role: "Coastal Hub", x: 383, y: 55 },
  { city: "New Capital", role: "Smart Projects", x: 516, y: 148 },
  { city: "Suez", role: "Industrial", x: 572, y: 150 },
  { city: "Sokhna", role: "Energy Corridor", x: 558, y: 193 },
];

// ── Product catalogue (Assembly Lines + Supplies) ──────────────────────────
export const lowVoltage = {
  title: "Low Voltage",
  intro:
    "Powerline is a certified ABB panel builder offering fully type-tested solutions for low voltage boards up to 6300A and short circuit up to 120KA, with compliance to IEC 61439-1, IEC 61439-2 and IEC 61439-3 standards and ABB guidelines.",
  highlight: [
    "Main Distribution Board System PRO-E up to 6300A",
    "Powerline's own MDB design, approved from EEHC up to 5000A",
  ],
  products: [
    { name: "PLP", href: "/products/plp", desc: "Local modular type-tested low-voltage distribution panel for power distribution and motor control." },
    { name: "PRO-E", href: "/products/pro-e", desc: "Modular type-tested distribution panel compliant with IEC 61439-1 & 2." },
    { name: "Minicenter", href: "/products/minicenter", desc: "For residential and commercial segments — different designs up to 24 modules." },
    { name: "UniKIT", href: "/products/unikit", desc: "Innovative enclosure system rated up to 630A with quick assembly." },
    { name: "SR Basic", href: "/products/sr-basic", desc: "Low and medium-sized enclosures with a high degree of protection." },
  ],
};

export const mediumVoltage = {
  title: "Medium Voltage",
  intro:
    "Medium voltage switchgear, ring main units and compact substations engineered to international standards, built with global technology partners including Schneider Electric and Lucy Electric.",
  products: [
    { name: "PCSS", href: "/products/pcss", desc: "Compact Secondary Substation — 3 compartments (MV–transformer–LV), approved by EEHC." },
    { name: "PRAL", href: "/products/pral", desc: "Air-insulated 12/24 KV Ring Main Unit based on ABB NAL/NALF load break switches." },
    { name: "PSEC", href: "/products/psec", desc: "SF6 12/24 KV Ring Main Unit using ABB and Murge SF6 load break switches." },
    { name: "GIS Ring Main Units 12 & 24 KV", href: "/products/gis-ring-main-units-12-24-kv", desc: "Aegis Plus — Powerline under license of Lucy Electric." },
    { name: "Switchgear MCset", href: "/products/switchgear-mcset", desc: "Schneider MCset switchgear up to 24KV." },
  ],
};

export const dryTransformers = {
  title: "Dry Transformers",
  intro:
    "Air-cooled dry-type distribution transformers from leading partners — engineered for safe, efficient power distribution in indoor or environmentally sensitive locations.",
  products: [
    { name: "Dry Type Transformers", href: "/products/dry-type-transformers", desc: "Air-cooled dry-type distribution transformer up to 3,000 kVA, 12/24 kV." },
  ],
};

export const supplies = {
  title: "Supplies",
  intro:
    "Powerline's Supplies collection features high-quality oil-immersed distribution transformers from leading partners like Hitachi Energy and El Sewedy — for indoor and outdoor use across utility, industrial and commercial sectors.",
  products: [
    { name: "Oil Type Transformers", href: "/products/oil-type-transformers", desc: "Oil-immersed distribution transformer up to 3,000 kVA, 12/24 kV." },
  ],
};

// Full product detail pages keyed by slug.
export const products = {
  "dry-type-transformers": {
    title: "Dry Type Transformers",
    line: "Dry Transformers",
    img: "/img/prod-dry.webp",
    badge: "/img/type-tested.webp",
    lead:
      "Dry-Type Distribution Transformer. This air-cooled, dry-type transformer is engineered for safe and efficient power distribution in indoor or environmentally sensitive locations.",
    specs: [
      { k: "Rating", v: "Up to 3,000 kVA" },
      { k: "Voltage class", v: "12 / 24 kV" },
      { k: "Cooling", v: "Air-cooled" },
      { k: "Standards", v: "IEC compliant" },
    ],
    features: [
      "Built to comply with IEC standards",
      "Low maintenance",
      "Flame-retardant insulation",
      "Robust performance in commercial, industrial and infrastructure applications",
    ],
  },
  "oil-type-transformers": {
    title: "Oil Type Transformers",
    line: "Supplies",
    img: "/img/prod-oil.webp",
    lead:
      "Oil-Immersed Distribution Transformer designed for medium-voltage distribution networks, offering reliable performance and long service life.",
    specs: [
      { k: "Rating", v: "Up to 3,000 kVA" },
      { k: "Voltage class", v: "12 / 24 kV" },
      { k: "Standards", v: "IEC 60076 / ANSI" },
    ],
    features: [
      "Reliable performance for utility, industrial and commercial applications",
      "Efficient voltage regulation and thermal stability",
      "Functions under varying load conditions",
      "Long service life capability",
    ],
  },
  plp: {
    title: "PLP",
    line: "Low Voltage",
    img: "/img/prod-plp.webp",
    gallery: ["/img/prod-plp.webp", "/img/prod-plp-2.webp"],
    badge: "/img/type-tested.webp",
    lead:
      "PLP is our local, fully type-tested low-voltage distribution panel designed for power distribution and motor control in commercial, industrial, and infrastructure applications. It is Type Tested by Powerline, verified against IEC standards for safety and performance.",
    specs: [
      { k: "Type", v: "Modular, type-tested" },
      { k: "Manufacturing", v: "Local" },
      { k: "Standards", v: "IEC & international certifications" },
      { k: "Partners", v: "ABB & Schneider Electric" },
    ],
    features: [
      "Type Tested by Powerline",
      "Modular type-tested design",
      "Local manufacturing",
      "Suitable for commercial, industrial and infrastructure applications",
      "Available as customized solutions per client specifications",
    ],
  },
  "switchgear-mcset": {
    title: "Switchgear MCset",
    line: "Medium Voltage",
    img: "/img/prod-mcset.webp",
    lead:
      "Schneider MCset medium-voltage switchgear, assembled by Powerline up to 24KV — engineered to IEC standards in partnership with Schneider Electric.",
    specs: [
      { k: "Voltage class", v: "Up to 24 kV" },
      { k: "Technology", v: "Schneider MCset" },
      { k: "Standards", v: "IEC compliant" },
    ],
    features: [
      "Medium voltage assembly line",
      "Built in partnership with Schneider Electric",
      "Compliant with IEC standards",
    ],
  },
  "gis-ring-main-units-12-24-kv": {
    title: "GIS Ring Main Units 12 & 24 KV",
    line: "Medium Voltage",
    img: "/img/prod-gis-rmu.webp",
    lead:
      "Lucy Electric is an international leader in switching and protection solutions. We provide Aegis Plus — Powerline under license of Lucy Electric.",
    specs: [
      { k: "Voltage class", v: "12 / 24 kV" },
      { k: "Range", v: "Extensible & non-extensible" },
      { k: "Licence", v: "Lucy Electric — Aegis Plus" },
    ],
    features: [
      "Automation ready with integrated RTU",
      "Network condition monitoring",
      "Automatic Transfer Scheme (ATS)",
      "Circuit breaker with auto re-close mechanism",
      "Transformer protection with vacuum circuit breaker or HV fuse switch",
      "Indoor and outdoor installation",
      "Enhanced internal arc safety",
      "Multiple cable termination heights",
      "Reduced spatial footprint",
    ],
  },
  "pro-e": {
    title: "PRO-E",
    line: "Low Voltage",
    img: "/img/prod-pro-e.webp",
    gallery: ["/img/prod-pro-e.webp", "/img/prod-pro-e-2.webp"],
    lead:
      "Pro-E is a modular type-tested low-voltage distribution panel designed for power distribution and motor control in commercial, industrial, and infrastructure applications. It complies with IEC 61439-1 & 2 standards, ensuring high safety, reliability, and performance under various operating conditions.",
    specs: [
      { k: "Type", v: "Modular, type-tested" },
      { k: "Rated current", v: "Up to 6300 A" },
      { k: "Standards", v: "IEC 61439-1 & 2" },
      { k: "Application", v: "Distribution & motor control" },
    ],
    features: [
      "Fully type-tested main distribution board system",
      "Compliant with IEC 61439-1 & 2 standards",
      "High safety, reliability and performance under various operating conditions",
      "Suitable for commercial, industrial and infrastructure applications",
    ],
  },
  "minicenter": {
    title: "Minicenter",
    line: "Low Voltage",
    img: "/img/prod-minicenter.webp",
    gallery: ["/img/prod-minicenter.webp", "/img/prod-minicenter-2.webp"],
    lead:
      "Minicenter — the successful future in residential and commercial segments, designed to provide safety and reliability. Available in different designs up to 24 modules.",
    specs: [
      { k: "Segment", v: "Residential & commercial" },
      { k: "Capacity", v: "Up to 24 modules" },
      { k: "Focus", v: "Safety & reliability" },
    ],
    features: [
      "Designed for residential and commercial segments",
      "Different designs up to 24 modules",
      "Engineered for safety and reliability",
    ],
  },
  unikit: {
    title: "UniKIT",
    line: "Low Voltage",
    img: "/img/prod-unikit.webp",
    gallery: ["/img/prod-unikit.webp", "/img/prod-unikit-2.webp"],
    lead:
      "Unikit is an innovative enclosure system rated up to 630A, offering maximum functionality, simplicity, flexibility and quick assembly.",
    specs: [
      { k: "Rated current", v: "Up to 630 A" },
      { k: "Type", v: "Innovative enclosure system" },
    ],
    features: [
      "Maximum functionality",
      "Simplicity and flexibility",
      "Quick assembly",
      "Rated up to 630A",
    ],
  },
  "sr-basic": {
    title: "SR Basic",
    line: "Low Voltage",
    img: "/img/prod-sr-basic.webp",
    gallery: [
      "/img/prod-sr-basic.webp",
      "/img/prod-sr-basic-2.webp",
      "/img/prod-sr-basic-3.webp",
      "/img/prod-sr-basic-4.webp",
    ],
    lead:
      "SR Basic offers low voltage and medium-sized enclosures for automation and distribution, with a high degree of protection in accordance with standard.",
    specs: [
      { k: "Type", v: "LV & medium-sized enclosures" },
      { k: "Use", v: "Automation & distribution" },
      { k: "Protection", v: "High degree (per standard)" },
    ],
    features: [
      "Low voltage and medium-sized enclosures",
      "Suitable for automation and distribution",
      "High degree of protection in accordance with standard",
    ],
  },
  pcss: {
    title: "PCSS",
    line: "Medium Voltage",
    img: "/img/prod-pcss.webp",
    gallery: [
      "/img/prod-pcss.webp",
      "/img/prod-pcss-2.webp",
      "/img/prod-pcss-3.webp",
      "/img/prod-pcss-4.webp",
    ],
    badge: "/img/type-tested.webp",
    lead:
      "PLP-CSS is a local Medium Voltage Compact Secondary Substation consisting of 3 compartments (MV–transformer–LV), suitable for a wide range of electrical equipment and easily transported even to remote places — approved by EEHC.",
    specs: [
      { k: "Configuration", v: "3 compartments (MV / Transformer / LV)" },
      { k: "Medium voltage", v: "12 / 24 KV — Air, SF6, GIS RMU" },
      { k: "Transformer", v: "Up to 1500 KVA (Oil or Dry)" },
      { k: "Low voltage", v: "Up to 3200 A" },
      { k: "Approval", v: "EEHC" },
    ],
    features: [
      "Easily maintained",
      "Structure integrity",
      "Smart Kiosks",
      "Different layouts",
      "Easily transported, even to remote places",
    ],
  },
  pral: {
    title: "PRAL",
    line: "Medium Voltage",
    img: "/img/prod-pral.webp",
    gallery: ["/img/prod-pral.webp", "/img/prod-pral-2.webp"],
    badge: "/img/type-tested.webp",
    lead:
      "PRAL 12KV & 24KV Air Ring Main Unit — a compact switchgear solution for secondary power distribution networks, based on ABB load break switches NAL/NALF.",
    specs: [
      { k: "Voltage class", v: "12 / 24 kV" },
      { k: "Insulation", v: "Air (AIS)" },
      { k: "Switches", v: "ABB NAL / NALF" },
    ],
    features: [
      "Metal enclosed unit for indoor installation",
      "Insulated by air (AIS)",
      "Maintenance-free and easy installation",
      "ON-OFF-Earth three-position load break switch",
      "Recyclable materials used",
      "Safe to approach and operate with power in the cables",
      "Fully automatic interlocking system",
      "Long service life — no additional replacement costs",
    ],
  },
  psec: {
    title: "PSEC",
    line: "Medium Voltage",
    img: "/img/prod-psec.webp",
    gallery: ["/img/prod-psec.webp", "/img/prod-psec-2.webp", "/img/prod-psec-3.webp"],
    badge: "/img/type-tested.webp",
    lead:
      "PSEC 12KV & 24KV SF6 Ring Main Unit — a compact switchgear solution for secondary power distribution networks, using ABB SF6 and Murge SF6 load break switches.",
    specs: [
      { k: "Voltage class", v: "12 / 24 kV" },
      { k: "Insulation", v: "SF6" },
      { k: "Switches", v: "ABB SF6 / Murge SF6" },
    ],
    features: [
      "Metal enclosed unit for indoor installation",
      "Maintenance-free and easy installation",
      "ON-OFF-Earth three-position load break switch",
      "Recyclable materials used",
      "Safe to operate in the presence of power in the cables",
      "Fully automatic interlocking system",
      "Long service life",
      "Smart-grid ready with PLC/RTU feeder automation for remote control",
    ],
  },
};

export const aboutCopy = {
  headline: "Powerline is",
  lead:
    "a leading provider of low and medium voltage electrical panels serving industries and infrastructure projects across Egypt and the region since 2012.",
  body:
    "With a focus on quality, innovation, and reliability, we design, manufacture, and service cutting-edge electrical solutions from two advanced facilities built to international standards.",
  partnerStatement:
    "WE ARE THE TRUSTED PARTNERS TO GLOBAL LEADERS — offering technical expertise, product support, and performance optimization to keep power systems running smoothly.",
};

// Map a collection's products to nav leaf items.
const toLeaves = (col) => col.products.map((p) => ({ label: p.name, href: p.href }));

export const nav = [
  { label: "Home", href: "/" },
  { label: "Who We Are", href: "/about" },
  {
    label: "Our Products",
    href: "/our-products",
    children: [
      { label: "Low Voltage", href: "/low-voltage", children: toLeaves(lowVoltage) },
      { label: "Medium Voltage", href: "/medium-voltage", children: toLeaves(mediumVoltage) },
      { label: "Dry Transformers", href: "/products/dry-type-transformers", children: toLeaves(dryTransformers) },
    ],
  },
  {
    label: "Supplies",
    href: "/supplies",
    children: toLeaves(supplies),
  },
  { label: "Locations", href: "/locations" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/contact" },
];
