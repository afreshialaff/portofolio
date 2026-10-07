/**
 * Single source of truth for every piece of copy on the site.
 * Sources (nothing here is invented):
 *  1. The résumé (public/Afreshia-Laffintha-Asmy-Resume.pdf), a LinkedIn
 *     "Resume generated from profile" export, including its embedded links.
 *  2. The owner's portfolio notes "Portofolio — Finance, Accounting, Tax & Consulting"
 *     (chapters 1–7 + case studies), translated from Bahasa Indonesia.
 *     Client names are not used anywhere on the site.
 */

/* ------------------------------------------------------------------ types */
export type NavItem = { id: string; label: string };

export type SkillFamily =
  | "Accounting"
  | "Finance"
  | "Tax"
  | "Payroll"
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
  ui: "ledger" | "recon" | "tax" | "audit" | "flow" | "apps" | "book" | "payroll" | "erp" | "amazon";
};

export type CaseStudy = {
  id: string;
  title: string;
  sector: string;
  challenge: string;
  contribution: string;
  result: string;
  /** which animated finance visual to draw */
  anim: "erp" | "statements" | "waterfall" | "recon" | "allocation" | "pph21";
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
  /** Portfolio notes, "short text for the home page", paragraph 2 (translated). */
  aboutPractice:
    "My experience covers construction, engineering, trading, and a Singapore retail company selling through Amazon — including complete financial statements through to the notes. I have also implemented an ERP for three client companies, with accounting, finance, invoicing and HRD modules tailored to each business.",
  focus: "Accounting · Finance · Tax · Payroll · ERP",
  /** Paraphrase of the résumé's own words ("where better financial processes can lead to better business decisions"). */
  quote: "Better financial processes lead to better business decisions.",
  /** ID-card back — every line is a résumé fact. */
  idCardFacts: [
    "Senior Associate & Chartered Accountant (IAI)",
    "B. Accounting, Universitas Negeri Malang · GPA 3.9/4.0",
    "20+ clients · 5,000+ transactions reconciled monthly",
    "ERP implemented for 3 client companies",
    "CoreTax · Accurate · Mekari Jurnal · MYOB · Zahir",
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
  { id: "cases", label: "Cases" },
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
// portfolio-notes chapters
const C1 = "Ch.1 Accounting & financial reporting";
const C2 = "Ch.2 Finance & reconciliation";
const C3 = "Ch.3 Tax & Coretax support";
const C4 = "Ch.4 Payroll & project accounting";
const C5 = "Ch.5 Process & finance systems";
const C6 = "Ch.6 Consulting & client communication";
const C7 = "Ch.7 Singapore company & Amazon accounting";

export const SKILL_GROUPS: SkillGroup[] = [
  {
    family: "Accounting",
    skills: [
      { name: "Financial Reporting", symbol: "Fr", family: "Accounting", icon: "report", usedIn: [FP_SA, TJ, MP] },
      { name: "Multi-entity Bookkeeping", symbol: "Bk", family: "Accounting", icon: "ledger", usedIn: [FP_SA, C1] },
      { name: "Year-End Accounting", symbol: "Ye", family: "Accounting", icon: "calendar", usedIn: [TOP] },
      { name: "Month-end Working Papers", symbol: "Wp", family: "Accounting", icon: "papers", usedIn: [FP_SA, C1] },
      { name: "Financial Statement Analysis", symbol: "Fs", family: "Accounting", icon: "chart", usedIn: [FP_AFC, C1] },
      { name: "Notes to the Financial Statements", symbol: "Nf", family: "Accounting", icon: "book", usedIn: [C7] },
      { name: "Amazon Seller Accounting", symbol: "Am", family: "Accounting", icon: "boxes", usedIn: [C7] },
    ],
  },
  {
    family: "Finance",
    skills: [
      { name: "Cash & Bank Reconciliation", symbol: "Rc", family: "Finance", icon: "match", usedIn: [FP_SA, FP_AFC, C2] },
      { name: "Petty Cash & Expense Mapping", symbol: "Pe", family: "Finance", icon: "invoice", usedIn: [C2] },
      { name: "Credit Card & Owner Transactions", symbol: "Oc", family: "Finance", icon: "people", usedIn: [C2] },
      { name: "Receivables & Project Receipts", symbol: "Ar", family: "Finance", icon: "calendar", usedIn: [C2] },
      { name: "Corporate Finance", symbol: "Cf", family: "Finance", icon: "chart", usedIn: ["Professional training through ACCA"] },
    ],
  },
  {
    family: "Tax",
    skills: [
      { name: "Tax Planning", symbol: "Tp", family: "Tax", icon: "compass", usedIn: [TOP, TJ] },
      { name: "VAT / PPN Working Papers", symbol: "Pn", family: "Tax", icon: "percent", usedIn: [FP, TJ, C3] },
      { name: "Income Tax / PPh", symbol: "Ph", family: "Tax", icon: "percent", usedIn: [FP, TJ] },
      { name: "PPh 21 & Coretax XML", symbol: "P2", family: "Tax", icon: "form", usedIn: [C3] },
      { name: "Corporate Tax (PPh Badan)", symbol: "Pb", family: "Tax", icon: "building", usedIn: [FP_AFC] },
      { name: "SPT Tahunan", symbol: "St", family: "Tax", icon: "form", usedIn: [FP] },
      { name: "Regional Tax", symbol: "Rt", family: "Tax", icon: "pin", usedIn: [FP_AFC] },
      { name: "e-Faktur", symbol: "Ef", family: "Tax", icon: "invoice", usedIn: [TJ] },
      { name: "Tax Case Consulting", symbol: "Tc", family: "Tax", icon: "chat", usedIn: [C3] },
      { name: "Tax Appeal Support", symbol: "Ta", family: "Tax", icon: "scale", usedIn: [MP] },
      { name: "Singapore Reporting (IRAS)", symbol: "Sg", family: "Tax", icon: "globe", usedIn: [C7] },
    ],
  },
  {
    family: "Payroll",
    skills: [
      { name: "Attendance & Wage Allocation", symbol: "Wa", family: "Payroll", icon: "calendar", usedIn: [C4] },
      { name: "Payroll vs Tax Reconciliation", symbol: "Pr", family: "Payroll", icon: "match", usedIn: [C3, C4] },
      { name: "Payslip Portal", symbol: "Ps", family: "Payroll", icon: "app", usedIn: [C4] },
    ],
  },
  {
    family: "Audit & Risk",
    skills: [
      { name: "Internal Audit", symbol: "Ia", family: "Audit & Risk", icon: "search", usedIn: [TOP, FP_AFC] },
      { name: "Internal Controls & SOP Review", symbol: "Ic", family: "Audit & Risk", icon: "shield", usedIn: [FP_AFC] },
      { name: "Risk Assessment", symbol: "Ra", family: "Audit & Risk", icon: "alert", usedIn: [FP_AFC, FP_AI] },
      { name: "Forensic Accounting", symbol: "Fa", family: "Audit & Risk", icon: "fingerprint", usedIn: ["Certification: Forensic Accounting and Fraud Examination"] },
      { name: "Exception Review", symbol: "Ex", family: "Audit & Risk", icon: "alert", usedIn: [C5] },
      { name: "Stock Opname", symbol: "So", family: "Audit & Risk", icon: "boxes", usedIn: [MP] },
    ],
  },
  {
    family: "Systems",
    skills: [
      { name: "ERP Development", symbol: "Er", family: "Systems", icon: "nodes", usedIn: [C5, "Implemented for 3 client companies"] },
      { name: "CoreTax", symbol: "Ct", family: "Systems", icon: "app", usedIn: [FP_SA, FP_AFC, C3] },
      { name: "Mekari Jurnal", symbol: "Mj", family: "Systems", icon: "app", usedIn: [C1, C5] },
      { name: "Import Templates", symbol: "It", family: "Systems", icon: "papers", usedIn: [C5] },
      { name: "Accurate", symbol: "Ac", family: "Systems", icon: "app", usedIn: ["Cloud accounting — résumé summary"] },
      { name: "MYOB", symbol: "My", family: "Systems", icon: "myob", usedIn: ["Cloud accounting — résumé summary"] },
      { name: "Zahir", symbol: "Zh", family: "Systems", icon: "app", usedIn: ["Cloud accounting — résumé summary"] },
      { name: "Google Apps Script", symbol: "Gs", family: "Systems", icon: "app", usedIn: [C4] },
      { name: "DJP Online", symbol: "Dj", family: "Systems", icon: "app", usedIn: [TJ] },
      { name: "e-SPT", symbol: "Es", family: "Systems", icon: "app", usedIn: [TJ] },
      { name: "Shopee", symbol: "Sh", family: "Systems", icon: "shopee", usedIn: ["Sales Admin · Sylmi.basic"] },
    ],
  },
  {
    family: "AI & Data",
    skills: [
      { name: "AI & Web Solutions", symbol: "Ai", family: "AI & Data", icon: "spark", usedIn: [FP_AI] },
      { name: "Workflow Automation", symbol: "Au", family: "AI & Data", icon: "flow", usedIn: [FP_AI] },
      { name: "AI Governance", symbol: "Ag", family: "AI & Data", icon: "shield", usedIn: [FP_AI] },
      { name: "Machine Learning for Finance", symbol: "Ml", family: "AI & Data", icon: "nodes", usedIn: ["Professional training through ACCA"] },
      { name: "Big Data Analytics", symbol: "Bd", family: "AI & Data", icon: "database", usedIn: ["Virtual Intern · PT Kimia Farma × Rakamin"] },
    ],
  },
  {
    family: "Advisory",
    skills: [
      { name: "Financial Consulting", symbol: "Fc", family: "Advisory", icon: "chat", usedIn: [FP_AFC, C6] },
      { name: "Business Process Analysis", symbol: "Bp", family: "Advisory", icon: "flow", usedIn: [FP_AFC, C5] },
      { name: "Client Communication", symbol: "Cc", family: "Advisory", icon: "chat", usedIn: [C6] },
      { name: "SOPs & Documentation", symbol: "Sd", family: "Advisory", icon: "papers", usedIn: [FP_AI, FP_SA] },
      { name: "Review & Mentoring", symbol: "Rm", family: "Advisory", icon: "people", usedIn: [FP_SA] },
      { name: "Remote Engagements", symbol: "Re", family: "Advisory", icon: "globe", usedIn: [C6] },
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
/* Seven chapters of the portfolio notes + teaching from the résumé.
   Descriptions and features follow their wording; no client names. */
export const PROJECTS: Project[] = [
  {
    id: "accounting",
    index: "01",
    title: "Accounting & Reporting",
    kicker: "Multi-entity · month-end",
    description:
      "Transaction processing for several entities with different recording and reporting needs — and monthly bookkeeping and reporting for a portfolio of 20+ clients across construction, manufacturing, retail and F&B.",
    features: [
      "Chart of accounts, contact and project tagging in Mekari Jurnal",
      "Month-end working papers: AP, accruals, expenses, AR, sales, cash, inventory, tax",
      "Separating operating, project and owner costs, reimbursements and internal transfers",
      "Classification review traced back to supporting documents",
    ],
    tech: [
      { name: "Mekari Jurnal", icon: "app" },
      { name: "Accurate", icon: "app" },
      { name: "MYOB", icon: "myob" },
      { name: "Zahir", icon: "app" },
    ],
    ui: "ledger",
  },
  {
    id: "finance",
    index: "02",
    title: "Finance & Reconciliation",
    kicker: "Cash · bank · receivables",
    description:
      "Comparing bank statements with the books, general ledger and reported balances — including cross-account transactions, internal transfers, project receipts and unmatched items. 5,000+ transactions reconciled each month.",
    features: [
      "Balance working papers with a list of differences to follow up",
      "Petty cash mapped to accounts, contacts, projects and expense templates",
      "Credit cards, reimbursements, top-ups and owner balances",
      "Invoice monitoring: outstanding, partial, down payment, settled",
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
    title: "Tax & Coretax",
    kicker: "PPh 21 · PPN · SPT",
    description:
      "Indonesian tax compliance — VAT/PPN, income tax/PPh and annual returns (SPT Tahunan) through CoreTax — plus payroll data prepared for PPh 21 and Coretax XML.",
    features: [
      "PPh 21 data for permanent and non-permanent employees",
      "Payroll vs Coretax vs P&L comparison, Jan–Aug 2026",
      "VAT OUT / VAT IN mapping, invoices vs sales listing, DPP & PPN per item",
      "Consulting on construction tax cases, replacement invoices and gross-up",
    ],
    tech: [
      { name: "CoreTax", icon: "app" },
      { name: "e-Faktur", icon: "invoice" },
      { name: "DJP Online", icon: "app" },
    ],
    ui: "tax",
  },
  {
    id: "payroll",
    index: "04",
    title: "Payroll & Projects",
    kicker: "Attendance · wage allocation",
    description:
      "Workbooks that connect the worker master, weekly attendance, projects, extra pay and the allocation of labour cost to projects.",
    features: [
      "Mapping repaired across 19 weekly periods",
      "Dynamic dropdowns and an overtime component",
      "Eight attendance and project sheets reconciled (Sep 2026)",
      "Payslip portal in Google Sheets + Apps Script (ID & PIN, PDF) — in development",
    ],
    tech: [
      { name: "Google Apps Script", icon: "app" },
      { name: "Payroll", icon: "people" },
    ],
    ui: "payroll",
  },
  {
    id: "systems",
    index: "05",
    title: "Process & ERP",
    kicker: "3 client companies",
    description:
      "Developed and implemented an ERP for three construction client companies. The core accounting, finance, invoicing and HRD modules are complete, running smoothly and now in optimisation.",
    features: [
      "Workflows tailored to each company’s business process",
      "Import templates for bank, expense and credit memo (Mekari Jurnal)",
      "Exception review before final files are prepared",
      "AI tools, automation workflows and SOPs (Asst. Manager, AI & Knowledge)",
    ],
    tech: [
      { name: "ERP", icon: "nodes" },
      { name: "Automation", icon: "flow" },
      { name: "Governance", icon: "shield" },
    ],
    ui: "erp",
  },
  {
    id: "consulting",
    index: "06",
    title: "Consulting & Review",
    kicker: "Findings → next steps",
    description:
      "Helping clients understand unclear transactions, recording differences and how financial data links to tax needs — then turning technical findings into explanations they can act on.",
    features: [
      "Analysis built on supporting sources and clarifying questions",
      "Evaluate SOPs and internal controls; assess operational and financial risks",
      "First-level review of staff work before Manager review",
      "Remote work across several entities and systems",
    ],
    tech: [
      { name: "Internal Audit", icon: "search" },
      { name: "Client Communication", icon: "chat" },
    ],
    ui: "audit",
  },
  {
    id: "singapore",
    index: "07",
    title: "Singapore & Amazon",
    kicker: "Full FS with notes",
    description:
      "Accounting for a Singapore retail company selling through Amazon — turning Amazon reports into bookkeeping and complete financial statements, through to the notes.",
    features: [
      "Amazon reports as the data source for the books",
      "Financial statements with notes to the financial statements",
      "Disclosures updated to the company’s situation",
      "Report preparation for IRAS tax filing",
    ],
    tech: [
      { name: "Amazon reports", icon: "boxes" },
      { name: "IRAS", icon: "globe" },
    ],
    ui: "amazon",
  },
  {
    id: "writing",
    index: "08",
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

/* ------------------------------------------------------------------ case studies */
/* "Case studies for the website" from the portfolio notes (translated). */
export const CASES: CaseStudy[] = [
  {
    id: "erp",
    title: "A tailored ERP for three construction companies",
    sector: "Construction · systems",
    challenge: "Each company has different business processes and operational needs.",
    contribution:
      "Developed an ERP with accounting, finance, invoicing and HRD modules, adapting the workflow to each client’s requirements.",
    result:
      "Implemented and running smoothly at three client companies. Core modules meet the clients’ needs; optimisation and construction-specific requests continue.",
    anim: "erp",
  },
  {
    id: "amazon",
    title: "Financial statements for a Singapore Amazon seller",
    sector: "Retail · Singapore",
    challenge: "A retail company selling through Amazon needs its marketplace reports turned into company financial statements.",
    contribution:
      "Processed Amazon reports for accounting, prepared complete financial statements and updated the notes to the financial statements for Singapore reporting.",
    result: "Financial statements completed through to the notes, with data preparation supporting Singapore tax reporting.",
    anim: "statements",
  },
  {
    id: "wp",
    title: "Monthly accounting working papers",
    sector: "Month-end close",
    challenge: "Expense details and supporting balances were spread across the general ledger and the financial statements.",
    contribution: "Updated the AP, accrual and expense working papers and the related reports.",
    result: "Expense details and balances are available in working papers for review and tracing back to the general ledger.",
    anim: "waterfall",
  },
  {
    id: "recon",
    title: "Cash, bank and expense reconciliation",
    sector: "Finance",
    challenge: "Internal transfers, expense payments and owner transactions follow different recording patterns.",
    contribution: "Traced bank movements, mapped transaction types and prepared recording templates.",
    result: "A transaction recap and a list of differences separate matched items from those that need follow-up.",
    anim: "recon",
  },
  {
    id: "attendance",
    title: "Attendance and labour-cost allocation",
    sector: "Payroll · projects",
    challenge: "Formulas and mapping between periods caused attendance totals and project costs to disagree.",
    contribution: "Repaired the weekly mapping, dropdowns, overtime and cross-sheet formulas.",
    result: "The link between attendance data and project allocation was restored for the periods reviewed.",
    anim: "allocation",
  },
  {
    id: "pph21",
    title: "PPh 21 reconciliation",
    sector: "Tax",
    challenge: "Differences between payroll, Coretax and the expense in the P&L needed to be explained.",
    contribution: "Built a per-period comparison with components, differences and follow-up actions.",
    result: "Differences are identified and can be reviewed by source — disclosed for review, not assumed to be tax underpaid.",
    anim: "pph21",
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
  { label: "ERP implementations", caption: "Client companies running it", detail: "Accounting, finance, invoicing and HRD modules", value: 3, icon: "nodes" },
  { label: "Weekly periods", caption: "Attendance mapping repaired", detail: "Payroll & project-cost workbook", value: 19, icon: "calendar" },
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
