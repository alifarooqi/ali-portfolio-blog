import { IconKey } from "app/components/icons/Icons";

// Type for section refs
export type Sections = 'projects' | 'about' | 'review';

export interface SectionConfigType {
  link: Sections;
  name: string;
  headerIconKey: IconKey;
  notInMenu?: boolean;
}

const SectionConfig: SectionConfigType[] = [
  {
    link: 'projects',
    name: 'Projects',
    headerIconKey: 'projectSection',
  },
  {
    link: 'about',
    name: 'About',
    headerIconKey: 'aboutSection',
  },
  {
    link: 'review',
    name: 'Reviews',
    headerIconKey: 'reviewSection',
  },
];

export default SectionConfig;
