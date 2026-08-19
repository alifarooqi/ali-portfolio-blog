import { IconKey } from "../components/icons/Icons";

export type ExperienceEntry = {
  /** Job title, e.g. "Chief Technology Officer". */
  role: string;
  /** Company / organization name. */
  org: string;
  /** "City, Country" — shown next to the org. */
  location: string;
  /** Display period, e.g. "2023 — Present". */
  period: string;
  /** Employment type — "Full-time", "Contract", "Freelance", "Part-time". */
  type: string;
  /** Two-to-three-sentence summary of the role. */
  description: string;
  /** IconKeys rendered as chips under the description (see Icons.tsx). */
  tech: IconKey[];
};

// Curated highlight list, newest-first. Earlier roles (HKU research
// assistant, 2017–2019 internships at Anchor Point / Picha / Set Sail /
// GoTalents) are intentionally omitted — they live on LinkedIn.
const ExperienceConfig: ExperienceEntry[] = [
  {
    role: "Chief Technology Officer",
    org: "Great Wall Connect",
    location: "Hong Kong SAR · Hybrid",
    period: "Jul 2025 — Present",
    type: "Full-time",
    description:
      "Co-founder. Leading development and consultation of secure, scalable digital infrastructure that connects foreign companies with China's cloud and digital ecosystem — simplifying cross-border cloud, compliance, and connectivity between two digital worlds.",
    tech: ["terraform", "kubernetes"],
  },
  {
    role: "Lead Instructor (AI)",
    org: "Preface",
    location: "Hong Kong SAR · On-site",
    period: "May 2026 — Present",
    type: "Contract",
    description:
      "Design and deliver hands-on training on production AI systems — prompt and context engineering, custom GPTs, agent orchestration, retrieval workflows, and LLM application development for engineers and professionals.",
    tech: ["typescript", "nodejs"],
  },
  {
    role: "Event Tech (Timing)",
    org: "HYROX",
    location: "Mainland China · On-site",
    period: "Mar 2026 — Present",
    type: "Freelance",
    description:
      "Deploy, configure, and troubleshoot timing hardware and software for large-scale HYROX events across mainland China, supporting races with tens of thousands of participants.",
    tech: [],
  },
  {
    role: "Senior Software Engineer",
    org: "KM.ON by KARL MAYER",
    location: "Hong Kong SAR",
    period: "Jan 2024 — Jun 2025",
    type: "Full-time",
    description:
      "Architected the PKI system and a fault-tolerant IAM platform with attribute-based access control, integrated with the cloud; built an AWS Lambda + Python data-warehouse pipeline feeding analytics dashboards; drove GDPR and MLPS compliance; mentored engineers across teams.",
    tech: ["typescript", "nodejs", "terraform"],
  },
  {
    role: "Full Stack Engineer",
    org: "KM.ON by KARL MAYER",
    location: "Hong Kong SAR · Hybrid",
    period: "Aug 2020 — Dec 2023",
    type: "Full-time",
    description:
      "Built low-latency React/TypeScript frontends and a micro-frontend architecture (Webpack Module Federation); shipped the hybrid-authentication system serving users globally including mainland China; created a UI component library that cut maintenance costs by 40%.",
    tech: ["react", "typescript"],
  },
];

export default ExperienceConfig;
