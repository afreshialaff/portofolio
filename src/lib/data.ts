/**
 * Single source of truth for every piece of copy on the site.
 * Sources (nothing here is invented):
 *  1. LinkedIn résumé export and the latest CV (public/Afreshia-Laffintha-Asmy-Resume.pdf).
 *  2. The owner's portfolio notes (accounting, finance, tax, payroll, ERP, Singapore/Amazon) and
 *     revision brief, translated from Bahasa Indonesia. Client names are never used.
 *  3. Software exposure and concurrent roles as confirmed by the owner.
 */

/* ------------------------------------------------------------------ types */
export type NavItem = { id: string; label: string };

export type SkillFamily =
  | "Accounting"
  | "Finance"
  | "Tax"
  | "Payroll"
  | "Audit & Risk"
  | "ERP & Process"
  | "Consulting";

export type Skill = {
  name: string;
  symbol: string; // 2-letter "element" symbol
  family: SkillFamily;
  /** key into TechLogo BRAND or CONCEPT map */
  icon: string;
  /** how the skill is applied in practice */
  applied: string[];
  /** optional related case study id */
  caseId?: string;
  /** shown in the default (core) view */
  core?: boolean;
};

export type SkillGroup = { family: SkillFamily; skills: Skill[] };

export type Tool = { name: string; icon: string; note?: string };

export type TimelineStop = {
  kind: "education" | "experience" | "earlier";
  start: string; // sortable YYYY-MM
  period: string; // display
  title: string;
  place: string;
  location?: string;
  detail?: string;
  /** compact sub-items (used for the "earlier experience" summary) */
  items?: { title: string; place: string; period: string }[];
  badge?: string;
};

export type Service = {
  id: string;
  index: string;
  title: string;
  kicker: string; // who it is for
  description: string; // scope
  features: string[]; // example deliverables
  stages?: { label: string; text: string }[]; // tax: preparation / computation / review / submission
  tech: { name: string; icon: string }[];
  github?: string;
  /** which illustrative mini-UI to draw */
  ui: "ledger" | "recon" | "tax" | "audit" | "flow" | "apps" | "book" | "payroll" | "erp" | "amazon";
};
/** @deprecated alias kept for older imports */
export type Project = Service;

export type CaseStudy = {
  id: string;
  flagship?: boolean;
  title: string;
  industry: string;
  scope: string;
  role: string;
  challenge: string;
  contribution: string;
  deliverables: string;
  result: string;
  /** optional live vs. in-progress split */
  status?: { live: string; next: string };
  /** optional before / after, only from confirmed facts */
  beforeAfter?: { before: string; after: string };
  /** which animated finance visual to draw */
  anim: "erp" | "statements" | "jurisdiction" | "projects" | "waterfall" | "recon" | "allocation" | "pph21";
};

export type CredentialGroup = {
  id: string;
  title: string;
  items: { title: string; issuer?: string; year?: string; note?: string }[];
};

export type Achievement = {
  label: string;
  caption: string;
  detail: string;
  value?: number;
  /** text shown instead of a counted number */
  display?: string;
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
  credential: "Chartered Accountant (IAI)",
  /** two concurrent roles at FP Consulting Indonesia, in different divisions */
  roles: [
    {
      title: "Senior Associate",
      division: "Accounting",
      since: "Jul 2026",
    },
    {
      title: "Assistant Manager – AI & Knowledge Development",
      division: "AI & Knowledge Development",
      since: "Sep 2026",
    },
  ],
  roleShort: "Senior Associate · Asst. Manager",
  company: "FP Consulting Indonesia",
  email: "afreshiala@gmail.com",
  phone: "0856 3112 892",
  phoneHref: "tel:+628563112892",
  location: "Kota Malang, Jawa Timur, Indonesia",
  github: undefined as string | undefined,
  linkedin: "https://www.linkedin.com/in/afreshia-laffintha-asmy-",
  resume: "/Afreshia-Laffintha-Asmy-Resume.pdf",
  graduationYear: "2025",
  degree: "Bachelor of Accounting (S.Ak.)",
  school: "Universitas Negeri Malang",
  gpa: "3.9/4.0",
  hero: {
    lines: ["Accounting, Finance"],
    lead: "& Business",
    accent: "Consulting.",
    sub: "A Chartered Accountant working in consulting — handling many clients and several engagements in parallel, and adapting the approach to each business’s own process. Accounting, finance, tax and payroll for businesses across different industries.",
    points: [
      {
        title: "Multi-client, in parallel",
        text: "Several clients and engagements at once, each with its own systems, entities and deadlines.",
      },
      {
        title: "Adapted to each business",
        text: "Understanding how a company actually works before choosing the accounting, tax or system approach.",
      },
      {
        title: "Open to new jurisdictions",
        text: "Indonesian and Singapore reporting today; currently learning Australian taxation.",
      },
    ],
    selectedLabel: "Selected challenging cases",
    selected: [
      { id: "erp", label: "Custom ERP" },
      { id: "amazon", label: "Amazon seller accounting" },
      { id: "singapore", label: "Singapore tax & reporting" },
      { id: "construction", label: "Construction project finance" },
    ],
  },
  /** Résumé "Ringkasan" (summary), verbatim, split where the PDF merged paragraphs. */
  resumeSummary: [
    "Hello, I’m a Chartered Accountant (IAI) and finance professional based in Indonesia, specializing in financial reporting, tax compliance, accounting operations, and internal audit for small and medium-sized enterprises across construction, manufacturing, retail, and F&B industries.",
    "As a Senior Associate at FP Consulting Indonesia, I manage end-to-end monthly bookkeeping and financial reporting. I have handled 20+ multi-entity clients and checked and processed 5,000+ transactions in total across bank, cash, receivables, and payables accounts, and handle Indonesian tax compliance, including VAT/PPN, income tax/PPh, and annual tax returns (SPT Tahunan) through the government’s CoreTax system.",
    "My work goes beyond routine accounting. I focus on ensuring that financial information is accurate, well-supported, and useful for decision-making. I regularly investigate reconciliation discrepancies, review supporting documentation, identify accounting and tax risks, and coordinate adjustments with clients to ensure their financial records remain reliable and compliant.",
    "I also support businesses in improving their accounting processes through cloud-based accounting systems, including Accurate, Mekari Jurnal, MYOB, and Zahir. This includes helping clients streamline transaction recording, improve financial reporting workflows, strengthen documentation, and build more efficient accounting processes.",
    "I hold a Bachelor’s degree in Accounting from Universitas Negeri Malang with a GPA of 3.9/4.0, and I have pursued additional professional training in corporate finance and machine learning applications for finance professionals through ACCA.",
    "What I bring is a combination of technical accounting expertise, tax knowledge, analytical thinking, and a process-improvement mindset. I enjoy working at the intersection of finance, technology, and business operations, particularly where better financial processes can lead to better business decisions.",
    "I’m currently open to remote and international opportunities where I can contribute to a high-performing team, take on greater responsibility, and continue growing as a finance and accounting professional.",
  ],
  aboutPractice:
    "I work in consulting, handling many clients and several engagements in parallel and adapting my approach to each business. My work spans construction, engineering, trading and e-commerce — from complete financial statements through the notes for Amazon sellers, most of them Singapore-based, to a custom ERP built around construction clients’ business flows.",
  focus: "Accounting · Finance · Business consulting",
  quote: "Better financial processes lead to better business decisions.",
  /** ID-card back — every line is a confirmed fact. */
  idCardFacts: [
    "Chartered Accountant (IAI)",
    "B. Accounting, Universitas Negeri Malang · GPA 3.9/4.0",
    "Consulting · many clients in parallel",
    "Custom ERP · Amazon seller FS through the notes",
    "CoreTax · Accurate · Mekari Jurnal · MYOB · Zahir",
  ],
  languages: [
    { name: "Bahasa Indonesia", level: "Native or Bilingual" },
    { name: "English", level: "Limited Working" },
    { name: "Korean", level: "Elementary" },
  ],
  contactHints: [
    "Type of business and the country it operates in",
    "Accounting system or ERP you use today",
    "The main problem or the work you need done",
  ],
} as const;

/* ------------------------------------------------------------------ nav + section order */
export const NAV: NavItem[] = [
  { id: "about", label: "About" },
  { id: "services", label: "Services" },
  { id: "cases", label: "Cases" },
  { id: "skills", label: "Skills" },
  { id: "achievements", label: "Achievements" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
];

/* ------------------------------------------------------------------ services */
export const SERVICES: Service[] = [
  {
    id: "monthly",
    index: "01",
    title: "Monthly Accounting & Reporting",
    kicker: "Multi-entity · month-end",
    description:
      "Monthly bookkeeping and financial statements for businesses in construction, manufacturing, retail and F&B — including entities with different recording and reporting needs.",
    features: [
      "Monthly financial statements",
      "Month-end working papers: AP, accruals, expenses, AR, sales, cash, inventory, tax",
      "Chart of accounts, contact and project tagging per entity",
      "Classification review traced to supporting documents",
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
    id: "reconciliation",
    index: "02",
    title: "Reconciliation & Bookkeeping Cleanup",
    kicker: "Cash · bank · owner · receivables",
    description:
      "Bank statements compared with the books, general ledger and reported balances — cross-account transfers, project receipts, petty cash, credit cards and owner transactions.",
    features: [
      "Balance working paper with a list of differences to follow up",
      "Petty cash and expenses mapped to accounts, contacts and projects",
      "Owner transactions separated from company costs",
      "Invoice status: outstanding, partial, down payment, settled",
    ],
    tech: [
      { name: "Reconciliation", icon: "match" },
      { name: "Working papers", icon: "papers" },
    ],
    ui: "recon",
  },
  {
    id: "tax",
    index: "03",
    title: "Indonesian Tax & Coretax Support",
    kicker: "PPN · PPh · PPh 21 · SPT",
    description:
      "Tax work for Indonesian entities, split by what is actually done at each stage. Preparing a file is not the same as a filing being accepted — acceptance follows the system’s confirmation.",
    features: [],
    stages: [
      { label: "Preparation", text: "Tax data, working papers, PPh 21 import templates and Coretax XML" },
      { label: "Computation", text: "PPN (DPP and VAT per item), PPh, PPh Badan and tax simulations" },
      { label: "Review", text: "VAT IN / OUT vs. sales listing; payroll vs. Coretax vs. P&L" },
      { label: "Submission", text: "Monthly and annual returns through CoreTax for assigned clients" },
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
    title: "Payroll & Project Labour Allocation",
    kicker: "Construction · projects",
    description:
      "Workbooks that connect the worker master, weekly attendance, projects and extra pay to the allocation of labour cost per project.",
    features: [
      "Weekly attendance mapping and dynamic dropdowns",
      "Overtime component and wage changes by period",
      "Labour-cost allocation to projects",
      "Payslip portal in Google Sheets + Apps Script (in development)",
    ],
    tech: [
      { name: "Google Apps Script", icon: "googleappsscript" },
      { name: "Google Sheets", icon: "googlesheets" },
    ],
    ui: "payroll",
  },
  {
    id: "amazon",
    index: "05",
    title: "Amazon Seller Accounting",
    kicker: "E-commerce · any jurisdiction",
    description:
      "Amazon reports turned into bookkeeping and complete financial statements, through to the notes. Most clients are Singapore-based; the service itself is not limited to Singapore.",
    features: [
      "Amazon reports as the source for the books",
      "Bookkeeping and monthly records",
      "Complete financial statements",
      "Notes to the financial statements",
    ],
    tech: [
      { name: "Amazon reports", icon: "boxes" },
      { name: "Sellermetrix", icon: "chart" },
    ],
    ui: "amazon",
  },
  {
    id: "singapore",
    index: "06",
    title: "Singapore Tax & Financial Reporting",
    kicker: "Singapore companies",
    description:
      "Financial statements and notes prepared under the Singapore reporting framework that applies to the company, with report preparation for IRAS tax filing.",
    features: [
      "Financial statements with notes",
      "Disclosures updated to the company’s situation",
      "Accounting policies and supporting notes",
      "Report preparation for IRAS",
    ],
    tech: [
      { name: "IRAS", icon: "globe" },
      { name: "Sleek", icon: "app" },
    ],
    ui: "book",
  },
  {
    id: "erp",
    index: "07",
    title: "Custom ERP & Finance Workflow",
    kicker: "Construction clients",
    description:
      "An ERP developed around each company’s own business flow, plus standardised import templates and review steps for the finance team.",
    features: [
      "Accounting, finance, invoicing and HRD modules",
      "Workflows configured per company",
      "Import templates: bank, expense, credit memo",
      "Testing, user support and training",
    ],
    tech: [
      { name: "ERP", icon: "nodes" },
      { name: "Automation", icon: "flow" },
    ],
    ui: "erp",
  },
];
/** @deprecated alias */
export const PROJECTS = SERVICES;

/* ------------------------------------------------------------------ case studies */
export const CASES: CaseStudy[] = [
  {
    id: "erp",
    flagship: true,
    title: "A custom ERP built around each client’s business flow",
    industry: "Construction clients",
    scope: "Accounting, finance, invoicing and HRD modules",
    role: "Business-process analysis, AI-assisted development (Claude), testing, user support and training",
    challenge: "Each company runs its own business flow, so a standard setup would not fit how they actually work.",
    contribution: "Studied each company’s process, built and adapted the system with AI-assisted development (Claude), tested it, then supported and trained the users.",
    deliverables: "ERP implementations with accounting, finance, invoicing and HRD modules, configured per company.",
    result: "Core modules are complete, running smoothly and meet the requirements agreed with each client.",
    status: {
      live: "Core accounting, finance, invoicing and HRD modules in daily use",
      next: "Optimisation and additional construction-specific requests",
    },
    beforeAfter: {
      before: "Each company with its own business flow",
      after: "An ERP configured to that company’s flow",
    },
    anim: "erp",
  },
  {
    id: "amazon",
    flagship: true,
    title: "Amazon seller accounting through to the notes",
    industry: "E-commerce · Amazon sellers, mostly Singapore-based",
    scope: "Bookkeeping → financial statements → notes",
    role: "Report processing, bookkeeping, statements and notes",
    challenge: "Marketplace reports have to become company books and full financial statements.",
    contribution:
      "Processed Amazon reports into bookkeeping, prepared complete financial statements and updated the notes to the company’s situation.",
    deliverables: "Financial statements with notes to the financial statements.",
    result:
      "Statements completed through the notes. Tax and reporting for each client’s jurisdiction is handled as a separate step — the service is not limited to Singapore.",
    anim: "statements",
  },
  {
    id: "singapore",
    flagship: true,
    title: "Singapore tax and financial reporting",
    industry: "Singapore companies",
    scope: "Financial statements, notes and IRAS report preparation",
    role: "Prepared the statements, notes and IRAS reports",
    challenge:
      "Each jurisdiction sets its own reporting framework and tax requirements — they have to be understood before the numbers are prepared.",
    contribution:
      "Prepared financial statements and notes under the Singapore framework that applies to the company, and prepared reports for IRAS tax filing.",
    deliverables: "Complete financial statements with notes; reports prepared for IRAS.",
    result:
      "Statements completed through the notes, with data prepared for Singapore tax reporting. The same approach carries into new jurisdictions — currently learning Australian taxation.",
    anim: "jurisdiction",
  },
  {
    id: "construction",
    flagship: true,
    title: "Construction accounting and project finance",
    industry: "Construction · engineering",
    scope: "Project tagging, invoices and project receipts across years, labour cost per project",
    role: "Recorded, monitored and reconciled",
    challenge:
      "Costs, receipts and labour have to be tracked per project, and an invoice’s status cannot be read from one source alone.",
    contribution:
      "Tagged transactions by company and project in Mekari Jurnal, traced invoices against bank receipts and sales records, and linked labour cost to projects.",
    deliverables:
      "Project-tagged import templates, an invoice status monitor (outstanding, partial, down payment, settled) and labour allocation per project.",
    result:
      "Invoice status rests on matched transactions — an invoice is not called unpaid just because one source has no match.",
    anim: "projects",
  },
  {
    id: "wp",
    title: "Monthly accounting working papers",
    industry: "Multi-entity · month-end close",
    scope: "AP, accruals and expenses — August 2026 update",
    role: "Prepared and updated the working papers",
    challenge: "Expense details and supporting balances were spread across the general ledger and the financial statements.",
    contribution: "Updated the AP, accrual and expense working papers and the related reports.",
    deliverables: "Expense breakdown (G&A, financial and tax expenses, other payables) with balance-sheet and P&L support.",
    result: "Balances and expense details sit in one working paper, traceable back to the general ledger for review.",
    anim: "waterfall",
  },
  {
    id: "recon",
    title: "Cash, bank, expense and owner reconciliation",
    industry: "Finance · construction and trading",
    scope: "Bank, cash, expense and owner transactions",
    role: "Traced, mapped and prepared the templates",
    challenge: "Internal transfers, expense payments and owner transactions follow different recording patterns.",
    contribution: "Traced bank movements, mapped transaction types and prepared recording templates.",
    deliverables: "Transaction recap, list of differences and recording templates; cash & bank working paper with existing formulas kept.",
    result: "Matched items are separated from those that need follow-up; open differences stay visible for review.",
    anim: "recon",
  },
  {
    id: "attendance",
    title: "Attendance and project labour-cost allocation",
    industry: "Construction · payroll",
    scope: "19 weekly periods; 8 attendance and project sheets",
    role: "Repaired and rebuilt the workbook logic",
    challenge: "Formulas and mapping between periods made attendance totals and project costs disagree.",
    contribution: "Repaired the weekly mapping, dropdowns, overtime and cross-sheet formulas, keeping earlier periods intact.",
    deliverables: "Weekly mapping, dynamic dropdowns, an overtime component and corrected cross-sheet formulas.",
    result: "Attendance and project allocation are linked again and their totals agree for the periods reviewed.",
    anim: "allocation",
  },
  {
    id: "pph21",
    title: "Payroll, Coretax and GL reconciliation",
    industry: "Tax · payroll",
    scope: "Payroll vs. Coretax vs. P&L, January–August 2026",
    role: "Built the comparison and the import files",
    challenge: "Differences between payroll, Coretax and the expense in the P&L needed to be explained.",
    contribution: "Built a per-period comparison with components, differences, causes and follow-up actions.",
    deliverables: "Comparison sheet; Excel and Coretax XML templates for non-permanent employees.",
    result: "Differences are identified by source for review — not treated as tax underpaid. Preparing files is kept separate from filing confirmation.",
    anim: "pph21",
  },
];

/* ------------------------------------------------------------------ skills: practical expertise */
export const SKILL_GROUPS: SkillGroup[] = [
  {
    family: "Accounting",
    skills: [
      { name: "Monthly Accounting & Close", symbol: "Mc", family: "Accounting", icon: "ledger", core: true, caseId: "wp",
        applied: ["Monthly bookkeeping and reporting for a client portfolio", "Month-end working papers: AP, accruals, expenses, AR, cash, tax"] },
      { name: "Financial Reporting", symbol: "Fr", family: "Accounting", icon: "report", core: true,
        applied: ["Monthly statements across construction, manufacturing, retail and F&B", "Financial statements for 10+ MSMEs; four years of historical statements"] },
      { name: "Notes to the Financial Statements", symbol: "Nf", family: "Accounting", icon: "book", caseId: "amazon",
        applied: ["Complete statements through to the notes for Amazon sellers"] },
      { name: "Multi-entity Bookkeeping", symbol: "Me", family: "Accounting", icon: "papers",
        applied: ["Chart of accounts, contact and project tagging per entity in Mekari Jurnal"] },
      { name: "Year-End Accounting", symbol: "Ye", family: "Accounting", icon: "calendar",
        applied: ["Annual returns and year-end documentation for assigned clients"] },
      { name: "Cost Accounting", symbol: "Ca", family: "Accounting", icon: "chart", caseId: "attendance",
        applied: ["Labour-cost allocation to projects", "Inventory issues linked to cost of sales"] },
      { name: "Amazon Seller Accounting", symbol: "Am", family: "Accounting", icon: "boxes", core: true, caseId: "amazon",
        applied: ["Amazon reports processed into bookkeeping", "Most clients Singapore-based; not limited to Singapore"] },
    ],
  },
  {
    family: "Finance",
    skills: [
      { name: "Cash & Bank Reconciliation", symbol: "Rc", family: "Finance", icon: "match", core: true, caseId: "recon",
        applied: ["Bank, cash, receivables and payables reconciled each month", "Differences listed for follow-up"] },
      { name: "Bookkeeping Cleanup", symbol: "Bc", family: "Finance", icon: "search", caseId: "recon",
        applied: ["Classification review of owner, project and operating transactions"] },
      { name: "Petty Cash & Expense Mapping", symbol: "Pe", family: "Finance", icon: "invoice",
        applied: ["Petty cash mapped to accounts, contacts, projects and expense templates", "Checks for double recording and reimbursed items"] },
      { name: "Owner & Credit-card Transactions", symbol: "Oc", family: "Finance", icon: "people",
        applied: ["Credit cards, reimbursements, top-ups and owner balances"] },
      { name: "Receivables & Project Receipts", symbol: "Ar", family: "Finance", icon: "calendar", caseId: "construction",
        applied: ["Invoice monitoring across years: outstanding, partial, down payment, settled"] },
      { name: "Cash-flow Monitoring", symbol: "Cf", family: "Finance", icon: "chart",
        applied: ["Basic financial analysis and cash-flow monitoring for clients"] },
    ],
  },
  {
    family: "Tax",
    skills: [
      { name: "Indonesian Tax Compliance", symbol: "Tx", family: "Tax", icon: "percent", core: true,
        applied: ["PPN, PPh, PPh Badan, Regional Tax and SPT Tahunan through CoreTax"] },
      { name: "PPh 21 & Coretax XML", symbol: "P2", family: "Tax", icon: "form", caseId: "pph21",
        applied: ["Payroll data prepared for PPh 21; Excel and Coretax XML for non-permanent employees"] },
      { name: "VAT / PPN Working Papers", symbol: "Pn", family: "Tax", icon: "percent",
        applied: ["VAT OUT / IN mapping, invoices vs. sales listing, DPP and PPN per item"] },
      { name: "Tax Planning & Simulations", symbol: "Tp", family: "Tax", icon: "compass",
        applied: ["Tax calculation simulations to project future liabilities"] },
      { name: "Tax Case Analysis", symbol: "Tc", family: "Tax", icon: "chat",
        applied: ["Construction tax treatment, replacement invoices, gross-up and individual business schemes"] },
      { name: "Tax Appeal Support", symbol: "Ta", family: "Tax", icon: "scale",
        applied: ["Supporting documents compiled for tax appeal submissions"] },
      { name: "Singapore Tax & Reporting", symbol: "Sg", family: "Tax", icon: "globe", core: true, caseId: "singapore",
        applied: ["Statements and notes under the applicable Singapore framework", "Report preparation for IRAS"] },
    ],
  },
  {
    family: "Payroll",
    skills: [
      { name: "Attendance & Wage Allocation", symbol: "Wa", family: "Payroll", icon: "calendar", core: true, caseId: "attendance",
        applied: ["Weekly attendance linked to projects across 19 periods"] },
      { name: "Payroll–Coretax–GL Reconciliation", symbol: "Pr", family: "Payroll", icon: "match", caseId: "pph21",
        applied: ["Per-period comparison with component, difference, cause and follow-up"] },
      { name: "Payslip Portal", symbol: "Ps", family: "Payroll", icon: "app",
        applied: ["Google Sheets + Apps Script portal with ID & PIN, periods and PDF (in development)"] },
    ],
  },
  {
    family: "Audit & Risk",
    skills: [
      { name: "Internal Audit", symbol: "Ia", family: "Audit & Risk", icon: "search",
        applied: ["Financial audits and review of client bookkeeping and reporting"] },
      { name: "Internal Controls & SOP Review", symbol: "Ic", family: "Audit & Risk", icon: "shield", core: true,
        applied: ["Clients’ SOPs and internal controls evaluated for operational and financial risk"] },
      { name: "Risk Assessment", symbol: "Ra", family: "Audit & Risk", icon: "alert",
        applied: ["Accounting and tax risks identified during review"] },
      { name: "Exception Review", symbol: "Ex", family: "Audit & Risk", icon: "alert",
        applied: ["Incomplete transactions held for follow-up before final files"] },
      { name: "Stock Opname", symbol: "So", family: "Audit & Risk", icon: "boxes",
        applied: ["Stock counts at three warehouses reconciled with the records"] },
    ],
  },
  {
    family: "ERP & Process",
    skills: [
      { name: "ERP Development & Implementation", symbol: "Er", family: "ERP & Process", icon: "nodes", core: true, caseId: "erp",
        applied: ["Custom ERP live at construction clients", "AI-assisted development (Claude), testing, user support and training"] },
      { name: "Business Process Analysis", symbol: "Bp", family: "ERP & Process", icon: "flow", core: true, caseId: "erp",
        applied: ["Each client’s process studied before adapting the system", "Bookkeeping inefficiencies identified from SOPs"] },
      { name: "Import Templates & Standards", symbol: "It", family: "ERP & Process", icon: "papers",
        applied: ["Bank, expense and credit-memo imports with date, number, COA, contact and tagging rules"] },
      { name: "Cloud Accounting Rollout", symbol: "Cr", family: "ERP & Process", icon: "app",
        applied: ["Cloud-based accounting systems implemented for clients"] },
      { name: "Workflow Automation", symbol: "Au", family: "ERP & Process", icon: "flow",
        applied: ["Repetitive accounting, tax and payroll workflows automated"] },
      { name: "AI Tools & Governance", symbol: "Ag", family: "ERP & Process", icon: "spark",
        applied: ["AI and web-based tools with quality control, testing and data-security standards"] },
    ],
  },
  {
    family: "Consulting",
    skills: [
      { name: "Client Advisory", symbol: "Cv", family: "Consulting", icon: "chat", core: true,
        applied: ["Unclear transactions and recording differences explained against their sources"] },
      { name: "Findings & Next Steps", symbol: "Fn", family: "Consulting", icon: "report",
        applied: ["Technical accounting and tax issues turned into actions clients can take"] },
      { name: "Client Onboarding", symbol: "On", family: "Consulting", icon: "people",
        applied: ["New-client onboarding, internal documentation, templates and checklists"] },
      { name: "Data Requests & Clarification", symbol: "Dr", family: "Consulting", icon: "form",
        applied: ["Primary client contact for data requests, clarifications and progress updates"] },
      { name: "Quality Review", symbol: "Qr", family: "Consulting", icon: "shield",
        applied: ["First-level review of staff work against SOPs and checklists"] },
      { name: "Mentoring", symbol: "Mt", family: "Consulting", icon: "people",
        applied: ["Technical guidance for junior and probation staff"] },
      { name: "Team Training & Adoption", symbol: "Tt", family: "Consulting", icon: "book",
        applied: ["Team members trained on new tools and procedures"] },
      { name: "Tool Evaluation", symbol: "Te", family: "Consulting", icon: "compass",
        applied: ["AI tools and subscriptions evaluated for cost, risk and business impact"] },
      { name: "SOPs & Knowledge Bases", symbol: "Sp", family: "Consulting", icon: "papers",
        applied: ["SOPs, workflow documentation, user guides and internal knowledge bases"] },
      { name: "Multi-client, Parallel Work", symbol: "Mp", family: "Consulting", icon: "globe", core: true,
        applied: ["Many clients and several engagements handled in parallel", "Each entity’s accounting, tax and payroll needs handled on its own terms"] },
    ],
  },
];

/* ------------------------------------------------------------------ skills: software & tools */
export const TOOLS: { daily: Tool[]; exposure: Tool[] } = {
  daily: [
    { name: "Accurate", icon: "app" },
    { name: "Mekari Jurnal", icon: "app" },
    { name: "Zahir", icon: "app" },
    { name: "MYOB", icon: "myob" },
    { name: "ESB", icon: "app" },
    { name: "Ordoo", icon: "app" },
    { name: "CoreTax", icon: "app" },
    { name: "e-Faktur · e-SPT · DJP Online", icon: "invoice" },
    { name: "Microsoft Excel, Word, PowerPoint, Visio", icon: "papers" },
    { name: "Google Sheets", icon: "googlesheets" },
    { name: "Google Apps Script", icon: "googleappsscript" },
  ],
  exposure: [
    { name: "Xero", icon: "xero" },
    { name: "QuickBooks", icon: "quickbooks" },
    { name: "Sellermetrix", icon: "chart" },
    { name: "Sleek", icon: "app" },
    { name: "Amazon Services", icon: "boxes", note: "seller platform" },
    { name: "Shopee", icon: "shopee" },
    { name: "TikTok Shop", icon: "tiktok" },
    { name: "Tokopedia", icon: "boxes" },
    { name: "Lazada", icon: "boxes" },
    { name: "Blibli", icon: "blibli" },
    { name: "Bukalapak", icon: "bukalapak" },
  ],
};

export const TRAINING: { title: string; issuer?: string; status?: string }[] = [
  { title: "Corporate Finance", issuer: "ACCA" },
  { title: "Machine Learning Applications for Finance Professionals", issuer: "ACCA" },
  { title: "Australian taxation", status: "Ongoing learning" },
  { title: "Project-based virtual internship: Big Data Analytics", issuer: "PT Kimia Farma × Rakamin" },
  { title: "Project-based virtual internship: Product & Business Development", issuer: "Bank Muamalat × Rakamin" },
];

/* ------------------------------------------------------------------ credentials */
export const CREDENTIALS: CredentialGroup[] = [
  {
    id: "qualifications",
    title: "Professional qualifications",
    items: [
      { title: "Chartered Accountant (Advanced Level)", issuer: "Ikatan Akuntan Indonesia", year: "2025" },
      { title: "Tax Brevet A & B", year: "2025" },
      { title: "Certified Tax Technician (CTT)", year: "2025" },
      { title: "Certified Associate Accounting Technician (CAAT)", year: "2024" },
      { title: "Forensic Accounting and Fraud Examination" },
      { title: "Google Certified Educator", year: "2024" },
    ],
  },
  {
    id: "training",
    title: "Training & continuing development",
    items: [
      { title: "Corporate Finance", issuer: "ACCA" },
      { title: "Machine Learning Applications for Finance Professionals", issuer: "ACCA" },
      { title: "Australian taxation", note: "Ongoing learning" },
    ],
  },
  {
    id: "publications",
    title: "Publications & teaching",
    items: [
      { title: "Green Bonds in Asia and Europe: Green Investment or Greenwashing?", issuer: "Journal of International Business Ethics (Springer Nature), Scopus Q2", year: "2025" },
      { title: "Pembelajaran Pajak Terapan: Studi Kasus, Perhitungan, Dan Pelaporan", note: "Patent" },
      { title: "NSAFE 7 — Analisis Sistem Transaksi Dropship dalam Perspektif Islam" },
      { title: "Tantangan X Peluang: Strategi Give, Give, and Give Manuru.Id dalam Upaya Meningkatkan Integritas Akademik" },
      { title: "Two training module books on taxation", issuer: "Universitas Negeri Malang" },
    ],
  },
  {
    id: "awards",
    title: "Awards",
    items: [
      { title: "CA Scholarship Awardee", issuer: "Ikatan Akuntan Indonesia", year: "2024" },
      { title: "1st Place, Global Entrepreneur and Education Development Competition", issuer: "Universitas Negeri Malang", year: "2024" },
      { title: "1st Place, Office Festival — Business Model Canvas Competition", issuer: "UNS", year: "2024" },
      { title: "1st Place, Business Plan Competition, Business Fair 2024", issuer: "Unila", year: "2024" },
      { title: "1st Place, National Conference LABMA Scientific Fair", issuer: "UII", year: "2023" },
      { title: "Winner, Internal Accounting Competition — Accounting Festival “Sharmaine Eleftheria Eunoia”", year: "2021" },
      { title: "3rd Winner, Accounting Olympiad — Java-Bali Accounting, Skill, and English Competition (ASEC)" },
      { title: "Presenter, The 2nd International Creative Business Model Canvas Exhibition" },
      { title: "Participant, National Accounting Olympiad · Olimpiade Sains “Ekonomi” Kabupaten (OSK)" },
    ],
  },
];

/* ------------------------------------------------------------------ experience (latest first) */
export const TIMELINE: TimelineStop[] = [
  {
    kind: "experience",
    start: "2026-09",
    period: "Sep 2026 — Present",
    title: "Assistant Manager – AI & Knowledge Development",
    place: "FP Consulting Indonesia",
    location: "Kota Tangerang",
    badge: "Concurrent role",
    detail:
      "AI-powered tools, automation workflows, AI governance, testing and SOPs for accounting, tax, payroll and reporting; trains the team and evaluates tools for cost, risk and impact.",
  },
  {
    kind: "experience",
    start: "2026-07",
    period: "Jul 2026 — Present",
    title: "Senior Associate",
    place: "FP Consulting Indonesia",
    location: "Kota Tangerang",
    badge: "Concurrent role",
    detail:
      "Monthly bookkeeping and reporting for a client portfolio; reconciliations and tax working papers; first-level review and mentoring of junior staff; primary client contact.",
  },
  {
    kind: "experience",
    start: "2025-01",
    period: "Jan 2025 — Jun 2026",
    title: "Accountant and Financial Consultant",
    place: "FP Consulting Indonesia",
    location: "Kota Tangerang",
    detail:
      "Monthly statements across construction, manufacturing, retail and F&B; bank reconciliations; PPN, PPh, PPh Badan, Regional Tax and SPT Tahunan through CoreTax.",
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
    kind: "education",
    start: "2021-08",
    period: "2021 — 2025",
    title: "Bachelor (Sarjana), Accounting",
    place: "Universitas Negeri Malang",
    detail: "GPA 3.9/4.0",
  },
  {
    kind: "earlier",
    start: "2020-06",
    period: "2020 — 2023",
    title: "Earlier experience",
    place: "Internships and first roles",
    items: [
      { title: "Accounting & Tax Intern — financial statements for 10+ MSMEs", place: "Kantor Konsultan Pajak Tjarmadi & Rekan", period: "Jul — Dec 2023" },
      { title: "Accounting & Tax Intern — four years of statements, tax appeal, stock opname", place: "PT Mohan Putra Indonesia", period: "Sep — Nov 2023" },
      { title: "Project-based virtual internships", place: "Bank Muamalat · Kimia Farma × Rakamin", period: "Sep — Oct 2023" },
      { title: "Sales Admin — daily financial and sales reports", place: "Sylmi.basic", period: "Jun 2020 — Mar 2021" },
    ],
  },
];

/* ------------------------------------------------------------------ achievements (business first) */
export const ACHIEVEMENTS: Achievement[] = [
  { label: "Custom ERP", caption: "Developed and implemented for construction clients", detail: "Core modules live · optimisation ongoing", display: "ERP", icon: "nodes" },
  { label: "Clients", caption: "Multi-entity clients handled", detail: "Accounting, tax and reconciliation work", value: 20, suffix: "+", icon: "people" },
  { label: "Transactions", caption: "Checked and processed in total", detail: "Bank, cash, receivables and payables across those clients", value: 5000, suffix: "+", icon: "match" },
  { label: "Full reporting", caption: "Statements through to the notes", detail: "Amazon sellers · Singapore reporting framework", display: "Notes", icon: "book" },
  { label: "Jurisdictions", caption: "Indonesia and Singapore reporting", detail: "CoreTax filings · IRAS report preparation", value: 2, icon: "globe" },
  { label: "Weekly periods", caption: "Attendance mapping repaired", detail: "Payroll and project-cost workbook", value: 19, icon: "calendar" },
  { label: "MSMEs", caption: "Financial statements prepared", detail: "Kantor Konsultan Pajak Tjarmadi & Rekan", value: 10, suffix: "+", icon: "report" },
  { label: "GPA", caption: "Bachelor of Accounting", detail: "Universitas Negeri Malang, 2021 — 2025", value: 3.9, decimals: 1, suffix: "/4", icon: "cap" },
  { label: "First places", caption: "Accounting and business competitions", detail: "2021 — 2024 · see Credentials", value: 5, suffix: "×", icon: "trophy" },
  { label: "Scholarship", caption: "CA Scholarship Awardee", detail: "Ikatan Akuntan Indonesia, 2024", display: "CA", icon: "medal" },
];

/* ------------------------------------------------------------------ section numbering */
export const SECTION_ORDER: string[] = [
  "about",
  "services",
  "cases",
  "skills",
  "achievements",
  "experience",
  "credentials",
  "contact",
];
export const sectionIndex = (id: string) => String(SECTION_ORDER.indexOf(id) + 1).padStart(2, "0");
