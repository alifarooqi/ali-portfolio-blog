import { IconKey } from "app/components/icons/Icons";

// Type for section refs
export type Sections = "projects" | "about" | "review" | "contact";

export interface SectionConfigType {
  key: Sections;
  name: string;
  headerIconKey: IconKey;
  notInMenu?: boolean;
}

const SectionConfig: SectionConfigType[] = [
  {
    key: "projects",
    name: "Projects",
    headerIconKey: "projectSection",
  },
  {
    key: "about",
    name: "About",
    headerIconKey: "aboutSection",
  },
  {
    key: "review",
    name: "Reviews",
    headerIconKey: "reviewSection",
  },
  {
    key: "contact",
    name: "Contact",
    headerIconKey: "email",
  },
];

export default SectionConfig;
