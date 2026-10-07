/**
 * Single source of truth for every piece of copy on the site.
 * All content is taken from the résumé (public/Afreshia-Laffintha-Asmy-Resume.pdf),
 * a LinkedIn "Resume generated from profile" export, including its embedded links.
 * Nothing here is invented — if it isn't in the résumé, it isn't on the site.
 */

/* ------------------------------------------------------------------ types */
export type NavItem = { id: string; label: string };

export type SkillFamily =
  | "Accounting"
  | "Tax"
  | "Audit & Risk"
  | "Systems"
  | "AI & Data"
  | "Advisory"
  | "Languages";

export type Skill = {
  name: string;
  symbol: string; // 2-letter "element" symbol
  family: SkillFamily;
  /** key into TechLogo BRAND or CONCEPT map */
  icon: string;
  /** where the résumé shows this skill being used */
  usedIn: string[];
};

export type SkillGroup = { family: SkillFamily; skills: Skill[] };

export type TimelineStop = {
  kind: "education" | "experience";
  start: string; // sortable YYYY-MM
  period: string; // display
  title: string;
  place: string;
  location?: string;
  detail?: string;
};

export type Project = {
  id: string;
  index: string;
  title: string;
  kicker: string;
  description: string;
  features: string[];
  tech: { name: string; icon: string }[];
  github?: string;
  /** which illustrative mini-UI to draw */
  ui: "ledger" | "recon" | "tax" | "audit" | "flow" | "apps" | "book";
};

export type Certification = { title: string; issuer?: string; kind: "Certification" | "Training" };

export type Achievement = {
  label: string;
  caption: string;
  detail: string;
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  icon: string;
};

/* ------------------------------------------------------------------ profile */
export const PROFILE = {
  name: "Afreshia Laffintha Asmy",
  firstName: "Afreshia",
  initials: "AL",
  role: "Senior Associate",
  headline:
    "Senior Associate | Chartered Accountant (IAI) | Financial Reporting, Tax Compliance & Internal Audit | CAAT | CTT | Brevet A & B",
  heroRole: "Chartered Accountant",
  heroFocus: "Financial Reporting, Tax Compliance & Internal Audit",
  currentRole: "Assistant Manager – AI & Knowledge Development",
  company: "FP Consulting Indonesia",
  email: "afreshiala@gmail.com",
  phone: "0856 3112 892",
  phoneHref: "tel:+628563112892",
  location: "Kota Malang, Jawa Timur, Indonesia",
  github: undefined as string | undefined, // not listed in the résumé
  linkedin: "https://www.linkedin.com/in/afreshia-laffintha-asmy-",
  resume: "/Afreshia-Laffintha-Asmy-Resume.pdf",
  graduationYear: "2024",
  degree: "Bachelor of Accounting (Sarjana Akuntansi)",
  school: "Universitas Negeri Malang",
  gpa: "3.9/4.0",
  /** Résumé "Ringkasan" (summary), verbatim, split where the PDF merged paragraphs. */
  resumeSummary: [
    "Hello, I’m a Chartered Accountant (IAI) and finance professional based in Indonesia, specializing in financial reporting, tax compliance, accounting operations, and internal audit for small and medium-sized enterprises across construction, manufacturing, retail, and F&B industries.",
    "As a Senior Associate at FP Consulting Indonesia, I manage end-to-end monthly bookkeeping and financial reporting for a portfolio of 20+ clients, reconcile 5,000+ transactions across bank, cash, receivables, and payables accounts each month, and handle Indonesian tax compliance, including VAT/PPN, income tax/PPh, and annual tax returns (SPT Tahunan) through the government’s CoreTax system.",
    "My work goes beyond routine accounting. I focus on ensuring that financial information is accurate, well-supported, and useful for decision-making. I regularly investigate reconciliation discrepancies, review supporting documentation, identify accounting and tax risks, and coordinate adjustments with clients to ensure their financial records remain reliable and compliant.",
    "I also support businesses in improving their accounting processes through cloud-based accounting systems, including Accurate, Mekari Jurnal, MYOB, and Zahir. This includes helping clients streamline transaction recording, improve financial reporting workflows, strengthen documentation, and build more efficient accounting processes.",
    "I hold a Bachelor’s degree in Accounting from Universitas Negeri Malang with a GPA of 3.9/4.0, and I have pursued additional professional training in corporate finance and machine learning applications for finance professionals through ACCA.",
    "What I bring is a combination of technical accounting expertise, tax knowledge, analytical thinking, and a process-improvement mindset. I enjoy working at the intersection of finance, technology, and business operations, particularly where better financial processes can lead to better business decisions.",
    "I’m currently open to remote and international opportunities where I can contribute to a high-performing team, take on greater responsibility, and continue growing as a finance and accounting professional.",
  ],
  /** Paraphrase of the résumé's own words ("where better financial processes can lead to better business decisions"). */
  quote: "Better financial processes lead to better business decisions.",
  /** ID-card back — every line is a résumé fact. */
  idCardFacts: [
    "Senior Associate & Chartered Accountant (IAI)",
    "B. Accounting, Universitas Negeri Malang · GPA 3.9/4.0",
    "20+ clients · 5,000+ transactions reconciled monthly",
    "CoreTax · Accurate · Mekari Jurnal · MYOB · Zahir",
    "Winner, Internal Accounting Competition 2021",
  ],
  languages: [
    { name: "Bahasa Indonesia", level: "Native or Bilingual" },
    { name: "English", level: "Limited Working" },
    { name: "Korean", level: "Elementary" },
  ],
} as const;

/* ------------------------------------------------------------------ nav */
export const NAV: NavItem[] = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "work", label: "Work" },
  { id: "experience", label: "Experience" },
  { id: "achievements", label: "Achievements" },
  { id: "contact", label: "Contact" },
];

/* ------------------------------------------------------------------ skills */
const FP = "FP Consulting Indonesia";
const FP_SA = "Senior Associate · FP Consulting";
const FP_AFC = "Accountant & Financial Consultant · FP Consulting";
const FP_AI = "Asst. Manager, AI & Knowledge Dev. · FP Consulting";
const TJ = "Accounting & Tax Intern · Tjarmadi & Rekan";
const MP = "Accounting & Tax Intern · PT Mohan Putra Indonesia";
const TOP = "Listed as a top skill";

export const SKILL_GROUPS: SkillGroup[] = [
  {
    family: "Accounting",
    skills: [
      { name: "Financial Reporting", symbol: "Fr", family: "Accounting", icon: "report", usedIn: [FP_SA, TJ, MP] },
      { name: "Monthly Bookkeeping", symbol: "Bk", family: "Accounting", icon: "ledger", usedIn: [FP_SA] },
      { name: "Year-End Accounting", symbol: "Ye", family: "Accounting", icon: "calendar", usedIn: [TOP] },
      { name: "Reconciliation", symbol: "Rc", family: "Accounting", icon: "match", usedIn: [FP_SA, FP_AFC] },
      { name: "Financial Statement Analysis", symbol: "Fs", family: "Accounting", icon: "chart", usedIn: [FP_AFC] },
      { name: "Working Papers", symbol: "Wp", family: "Accounting", icon: "papers", usedIn: [FP_SA] },
    ],
  },
  {
    family: "Tax",
    skills: [
      { name: "Tax Planning", symbol: "Tp", family: "Tax", icon: "compass", usedIn: [TOP, TJ] },
      { name: "VAT / PPN", symbol: "Pn", family: "Tax", icon: "percent", usedIn: [FP, TJ] },
      { name: "Income Tax / PPh", symbol: "Ph", family: "Tax", icon: "percent", usedIn: [FP, TJ] },
      { name: "Corporate Tax (PPh Badan)", symbol: "Pb", family: "Tax", icon: "building", usedIn: [FP_AFC] },
      { name: "SPT Tahunan", symbol: "St", family: "Tax", icon: "form", usedIn: [FP] },
      { name: "Regional Tax", symbol: "Rt", family: "Tax", icon: "pin", usedIn: [FP_AFC] },
      { name: "e-Faktur", symbol: "Ef", family: "Tax", icon: "invoice", usedIn: [TJ] },
      { name: "Tax Appeal Support", symbol: "Ta", family: "Tax", icon: "scale", usedIn: [MP] },
    ],
  },
  {
    family: "Audit & Risk",
    skills: [
      { name: "Internal Audit", symbol: "Ia", family: "Audit & Risk", icon: "search", usedIn: [TOP, FP_AFC] },
      { name: "Internal Controls & SOP Review", symbol: "Ic", family: "Audit & Risk", icon: "shield", usedIn: [FP_AFC] },
      { name: "Risk Assessment", symbol: "Ra", family: "Audit & Risk", icon: "alert", usedIn: [FP_AFC, FP_AI] },
      { name: "Forensic Accounting", symbol: "Fa", family: "Audit & Risk", icon: "fingerprint", usedIn: ["Certification: Forensic Accounting and Fraud Examination"] },
      { name: "Stock Opname", symbol: "So", family: "Audit & Risk", icon: "boxes", usedIn: [MP] },
    ],
  },
  {
    family: "Systems",
    skills: [
      { name: "CoreTax", symbol: "Ct", family: "Systems", icon: "app", usedIn: [FP_SA, FP_AFC] },
      { name: "Accurate", symbol: "Ac", family: "Systems", icon: "app", usedIn: ["Cloud accounting — résumé summary"] },
      { name: "Mekari Jurnal", symbol: "Mj", family: "Systems", icon: "app", usedIn: ["Cloud accounting — résumé summary"] },
      { name: "MYOB", symbol: "My", family: "Systems", icon: "myob", usedIn: ["Cloud accounting — résumé summary"] },
      { name: "Zahir", symbol: "Zh", family: "Systems", icon: "app", usedIn: ["Cloud accounting — résumé summary"] },
      { name: "DJP Online", symbol: "Dj", family: "Systems", icon: "app", usedIn: [TJ] },
      { name: "e-SPT", symbol: "Es", family: "Systems", icon: "app", usedIn: [TJ] },
      { name: "Shopee", symbol: "Sh", family: "Systems", icon: "shopee", usedIn: ["Sales Admin · Sylmi.basic"] },
    ],
  },
  {
    family: "AI & Data",
    skills: [
      { name: "AI & Web Solutions", symbol: "Ai", family: "AI & Data", icon: "spark", usedIn: [FP_AI] },
      { name: "Workflow Automation", symbol: "Wa", family: "AI & Data", icon: "flow", usedIn: [FP_AI] },
      { name: "AI Governance", symbol: "Ag", family: "AI & Data", icon: "shield", usedIn: [FP_AI] },
      { name: "Machine Learning for Finance", symbol: "Ml", family: "AI & Data", icon: "nodes", usedIn: ["Professional training through ACCA"] },
      { name: "Big Data Analytics", symbol: "Bd", family: "AI & Data", icon: "database", usedIn: ["Virtual Intern · PT Kimia Farma × Rakamin"] },
    ],
  },
  {
    family: "Advisory",
    skills: [
      { name: "Financial Consulting", symbol: "Fc", family: "Advisory", icon: "chat", usedIn: [FP_AFC] },
      { name: "Business Process Analysis", symbol: "Bp", family: "Advisory", icon: "flow", usedIn: [FP_AFC] },
      { name: "Corporate Finance", symbol: "Cf", family: "Advisory", icon: "chart", usedIn: ["Professional training through ACCA"] },
      { name: "SOPs & Documentation", symbol: "Sd", family: "Advisory", icon: "papers", usedIn: [FP_AI, FP_SA] },
      { name: "Review & Mentoring", symbol: "Rm", family: "Advisory", icon: "people", usedIn: [FP_SA] },
    ],
  },
  {
    family: "Languages",
    skills: [
      { name: "Bahasa Indonesia", symbol: "Id", family: "Languages", icon: "globe", usedIn: ["Native or Bilingual"] },
      { name: "English", symbol: "En", family: "Languages", icon: "globe", usedIn: ["Limited Working"] },
      { name: "Korean", symbol: "Ko", family: "Languages", icon: "globe", usedIn: ["Elementary"] },
    ],
  },
];

/* ------------------------------------------------------------------ work (practice areas) */
/* The résumé lists no software projects or GitHub, so "Work" shows the areas of practice
   the résumé describes. Descriptions and features are taken from its wording. */
export const PROJECTS: Project[] = [
  {
    id: "reporting",
    index: "01",
    title: "Financial Reporting",
    kicker: "Monthly close · 20+ clients",
    description:
      "Manage end-to-end monthly bookkeeping and financial reporting for a portfolio of 20+ clients across construction, manufacturing, retail, and F&B.",
    features: [
      "Prepare and analyze monthly financial statements",
      "Accounting and tax working papers",
      "Monthly and annual tax documentation",
      "Deliverables checked against SOPs and checklists",
    ],
    tech: [
      { name: "Accurate", icon: "app" },
      { name: "Mekari Jurnal", icon: "app" },
      { name: "MYOB", icon: "myob" },
      { name: "Zahir", icon: "app" },
    ],
    ui: "ledger",
  },
  {
    id: "reconciliation",
    index: "02",
    title: "Reconciliation",
    kicker: "5,000+ transactions / month",
    description:
      "Reconcile 5,000+ transactions across bank, cash, receivables, and payables accounts each month — and investigate the discrepancies.",
    features: [
      "Bank, cash, receivables and payables",
      "Tax account reconciliations",
      "Review supporting documentation",
      "Coordinate adjustments with clients",
    ],
    tech: [
      { name: "Reconciliation", icon: "match" },
      { name: "Working Papers", icon: "papers" },
    ],
    ui: "recon",
  },
  {
    id: "tax",
    index: "03",
    title: "Tax Compliance",
    kicker: "CoreTax · PPN · PPh · SPT",
    description:
      "Handle Indonesian tax compliance, including VAT/PPN, income tax/PPh, and annual tax returns (SPT Tahunan) through the government’s CoreTax system.",
    features: [
      "Regional Tax and Corporate Tax (PPh Badan)",
      "SPT PPh, SPT PPN, e-Faktur, e-SPT",
      "Tax calculation simulations",
      "Supporting documents for tax appeals",
    ],
    tech: [
      { name: "CoreTax", icon: "app" },
      { name: "e-Faktur", icon: "invoice" },
      { name: "DJP Online", icon: "app" },
    ],
    ui: "tax",
  },
  {
    id: "audit",
    index: "04",
    title: "Audit & Risk",
    kicker: "Internal audit · controls",
    description:
      "Conduct financial audits and review client bookkeeping and reporting for accuracy and compliance.",
    features: [
      "Evaluate SOPs and internal controls",
      "Assess operational and financial risks",
      "Identify accounting and tax risks",
      "First-level review of staff work",
    ],
    tech: [
      { name: "Internal Audit", icon: "search" },
      { name: "Forensic Accounting", icon: "fingerprint" },
    ],
    ui: "audit",
  },
  {
    id: "ai",
    index: "05",
    title: "AI & Knowledge",
    kicker: "Since September 2026",
    description:
      "Lead the development and implementation of AI-powered tools, web-based solutions, automation workflows, and SOPs to improve the efficiency, accuracy, and scalability of accounting and professional services.",
    features: [
      "AI and web-based solutions for accounting, tax, payroll and reporting",
      "Automate repetitive workflows",
      "AI governance, testing and data-security standards",
      "SOPs, user guides and knowledge bases",
    ],
    tech: [
      { name: "AI Solutions", icon: "spark" },
      { name: "Automation", icon: "flow" },
      { name: "Governance", icon: "shield" },
    ],
    ui: "flow",
  },
  {
    id: "systems",
    index: "06",
    title: "Cloud Accounting",
    kicker: "Process improvement",
    description:
      "Support businesses in improving their accounting processes through cloud-based accounting systems, including Accurate, Mekari Jurnal, MYOB, and Zahir.",
    features: [
      "Streamline transaction recording",
      "Improve financial reporting workflows",
      "Strengthen documentation",
      "Build more efficient accounting processes",
    ],
    tech: [
      { name: "Accurate", icon: "app" },
      { name: "Mekari Jurnal", icon: "app" },
      { name: "MYOB", icon: "myob" },
      { name: "Zahir", icon: "app" },
    ],
    ui: "apps",
  },
  {
    id: "writing",
    index: "07",
    title: "Teaching & Writing",
    kicker: "Assistant Lecturer · UM",
    description:
      "Prepared two training module books on taxation and assisted faculty research at Universitas Negeri Malang.",
    features: [
      "Patent: Pembelajaran Pajak Terapan: Studi Kasus, Perhitungan, Dan Pelaporan",
      "NSAFE 7 — Analisis Sistem Transaksi Dropship dalam Perspektif Islam",
      "Tantangan X Peluang: Strategi Give, Give, and Give Manuru.Id dalam Upaya Meningkatkan Integritas Akademik",
      "Data collection, analysis and drafting for faculty research",
    ],
    tech: [
      { name: "Taxation", icon: "percent" },
      { name: "Research", icon: "search" },
    ],
    ui: "book",
  },
];

/* ------------------------------------------------------------------ certifications */
export const CERTIFICATIONS: Certification[] = [
  { title: "Chartered Accountant", issuer: "IAI", kind: "Certification" },
  { title: "Certified Associate Accounting Technician (CAAT)", kind: "Certification" },
  { title: "Forensic Accounting and Fraud Examination", kind: "Certification" },
  { title: "CTT", kind: "Certification" },
  { title: "Brevet A & B", kind: "Certification" },
  { title: "Corporate Finance", issuer: "ACCA", kind: "Training" },
  { title: "Machine Learning Applications for Finance Professionals", issuer: "ACCA", kind: "Training" },
];

/* ------------------------------------------------------------------ education + experience */
export const EDUCATION: TimelineStop[] = [
  { kind: "education", start: "2014-07", period: "2014 — 2017", title: "Junior High School", place: "SMP Negeri 2 Donomulyo" },
  { kind: "education", start: "2017-07", period: "2017 — 2020", title: "High School Diploma, Science (IPA)", place: "SMA Negeri 1 Pagak" },
  {
    kind: "education",
    start: "2021-08",
    period: "2021 — 2024",
    title: "Bachelor (Sarjana), Accounting",
    place: "Universitas Negeri Malang",
    detail: "GPA 3.9/4.0",
  },
];

export const EXPERIENCE: TimelineStop[] = [
  {
    kind: "experience",
    start: "2020-06",
    period: "Jun 2020 — Mar 2021",
    title: "Sales Admin",
    place: "Sylmi.basic",
    location: "Malang, Jawa Timur",
    detail: "Daily financial reports, sales reports for >4,000 customers per month, and all sales on Shopee.",
  },
  {
    kind: "experience",
    start: "2023-07",
    period: "Jul — Dec 2023",
    title: "Accounting & Tax Intern",
    place: "Kantor Konsultan Pajak Tjarmadi & Rekan",
    location: "Kota Blitar",
    detail: "Prepared financial statements for 10+ MSMEs; SPT PPh, SPT PPN, e-Faktur, e-SPT and DJP Online.",
  },
  {
    kind: "experience",
    start: "2023-09a",
    period: "Sep 2023",
    title: "Project-Based Virtual Intern: Big Data Analytics",
    place: "PT. Kimia Farma, Tbk × Rakamin Academy",
  },
  {
    kind: "experience",
    start: "2023-09b",
    period: "Sep — Nov 2023",
    title: "Accounting and Tax Intern",
    place: "PT Mohan Putra Indonesia",
    location: "Kalitidu, Bojonegoro",
    detail: "Financial statements for the past four years, tax-appeal documents, stock-opname at three warehouses.",
  },
  {
    kind: "experience",
    start: "2023-10",
    period: "Oct 2023",
    title: "Project-Based Virtual Intern: Product and Business Development Officer",
    place: "PT Bank Muamalat Indonesia Tbk × Rakamin Academy",
  },
  {
    kind: "experience",
    start: "2024-09",
    period: "Sep 2024 — Oct 2025",
    title: "Assistant Lecturer",
    place: "Universitas Negeri Malang",
    location: "Kota Malang",
    detail: "Prepared two training module books on taxation; supported faculty research.",
  },
  {
    kind: "experience",
    start: "2025-01",
    period: "Jan 2025 — Jun 2026",
    title: "Accountant and Financial Consultant",
    place: "FP Consulting Indonesia",
    location: "Kota Tangerang",
    detail: "Bank reconciliations of 3,000+ transactions monthly; PPN, PPh, PPh Badan and SPT Tahunan through CoreTax.",
  },
  {
    kind: "experience",
    start: "2026-07",
    period: "Jul 2026 — Present",
    title: "Senior Associate",
    place: "FP Consulting Indonesia",
    location: "Kota Tangerang",
    detail: "Monthly bookkeeping and reporting for a client portfolio; first-level review and mentoring of junior staff.",
  },
  {
    kind: "experience",
    start: "2026-09",
    period: "Sep 2026 — Present",
    title: "Assistant Manager – AI & Knowledge Development",
    place: "FP Consulting Indonesia",
    location: "Kota Tangerang",
    detail: "AI-powered tools, automation workflows, AI governance and SOPs for accounting services.",
  },
];

export const TIMELINE: TimelineStop[] = [...EDUCATION, ...EXPERIENCE].sort((a, b) =>
  a.start.localeCompare(b.start),
);

/* ------------------------------------------------------------------ achievements */
export const ACHIEVEMENTS: Achievement[] = [
  { label: "GPA", caption: "Bachelor of Accounting", detail: "Universitas Negeri Malang, 2021 — 2024", value: 3.9, decimals: 1, suffix: "/4", icon: "cap" },
  { label: "Clients", caption: "Monthly bookkeeping & reporting", detail: "Portfolio at FP Consulting Indonesia", value: 20, suffix: "+", icon: "people" },
  { label: "Transactions / month", caption: "Reconciled each month", detail: "Bank, cash, receivables and payables", value: 5000, suffix: "+", icon: "match" },
  { label: "Winner", caption: "Internal Accounting Competition", detail: "Accounting Festival 2021 “Sharmaine Eleftheria Eunoia”", value: 1, suffix: "st", icon: "trophy" },
  { label: "3rd Winner", caption: "Accounting Olympiad", detail: "Java-Bali Accounting, Skill, and English Competition (ASEC)", value: 3, suffix: "rd", icon: "medal" },
  { label: "MSMEs", caption: "Financial statements prepared", detail: "Kantor Konsultan Pajak Tjarmadi & Rekan", value: 10, suffix: "+", icon: "report" },
  { label: "Module books", caption: "Training modules on taxation", detail: "Assistant Lecturer, Universitas Negeri Malang", value: 2, icon: "book" },
  { label: "Customers / month", caption: "Covered by monthly sales reports", detail: "Sales Admin, Sylmi.basic", value: 4000, prefix: ">", icon: "chart" },
  {
    label: "More honours",
    caption: "Olympiads & exhibitions",
    detail: "National Accounting Olympiad (participant) · OSK “Ekonomi” · Presenter, 2nd International Creative BMC Exhibition",
    value: 3,
    prefix: "+",
    icon: "star",
  },
];
