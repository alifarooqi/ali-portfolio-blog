import { IconKey } from "../components/icons/Icons";

export type ExperienceEntry = {
  /** Job title, e.g. "Senior Cloud Engineer". */
  role: string;
  /** Company / organization name. */
  org: string;
  /** "City, Country" — shown next to the org. */
  location: string;
  /** Display period, e.g. "2023 — Present". */
  period: string;
  /** One- to three-sentence summary of the role. */
  description: string;
  /** IconKeys rendered as chips under the description (see Icons.tsx). */
  tech: IconKey[];
};

// ⚠️ PLACEHOLDER DATA — replace with real work history before merging.
// Entries render oldest-to-newest in the order listed here.
const ExperienceConfig: ExperienceEntry[] = [
  {
    role: "Software Engineer",
    org: "IoT Solutions Startup",
    location: "Remote",
    period: "2019 — 2021",
    description:
      "Built device-telemetry pipelines and dashboard features for connected-hardware customers; owned services from schema to deployment.",
    tech: ["typescript", "nodejs", "mongodb"],
  },
  {
    role: "Cloud Infrastructure Engineer",
    org: "Enterprise Solutions Provider",
    location: "Hong Kong",
    period: "2021 — 2023",
    description:
      "Designed and operated multi-region infrastructure for cross-border workloads, with a focus on reliability, cost, and compliance.",
    tech: ["kubernetes", "terraform", "postgresql"],
  },
  {
    role: "Senior Cloud Engineer",
    org: "Global Technology Company",
    location: "Shenzhen, China",
    period: "2023 — Present",
    description:
      "Lead secure, scalable platform design and help global engineering teams operate effectively in the Chinese cloud ecosystem.",
    tech: ["kubernetes", "terraform", "graphql", "java"],
  },
];

export default ExperienceConfig;
