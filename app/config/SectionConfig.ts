import { RefObject } from 'react';
import { getIcon } from '../components/icons/Icons';


// Type for section refs
export type Sections = 'projects' | 'about' | 'review';

export interface SectionConfigType {
  link: Sections;
  name: string;
  headerIcon: React.ReactElement;
  notInMenu?: boolean;
}

const SectionConfig: SectionConfigType[] = [
  {
    link: 'projects',
    name: 'Projects',
    headerIcon: getIcon('projectSection'),
  },
  {
    link: 'about',
    name: 'About',
    headerIcon: getIcon('aboutSection'),
  },
  {
    link: 'review',
    name: 'Reviews',
    headerIcon: getIcon('reviewSection'),
  },
];

export default SectionConfig;
