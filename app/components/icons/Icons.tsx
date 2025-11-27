import React, { ReactElement } from 'react';

// ICONS
import ComputerIcon from '@mui/icons-material/Computer';
import InfoIcon from '@mui/icons-material/Info';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import MapIcon from '@mui/icons-material/Map';
import CodeIcon from '@mui/icons-material/Code';
import LinkIcon from '@mui/icons-material/Link';
import WebIcon from '@mui/icons-material/Web';
import MailIcon from '@mui/icons-material/Mail';
import Twitter from '@mui/icons-material/Twitter';
import SecurityIcon from '@mui/icons-material/Security';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import EnergySavingsLeafIcon from '@mui/icons-material/EnergySavingsLeaf';
import VideogameAssetIcon from '@mui/icons-material/VideogameAsset';
import AppShortcutIcon from '@mui/icons-material/AppShortcut';
import TimerIcon from '@mui/icons-material/Timer';
import HandymanIcon from '@mui/icons-material/Handyman';
import ScheduleIcon from '@mui/icons-material/Schedule';
import Description from '@mui/icons-material/Description';
import ReviewsIcon from '@mui/icons-material/Reviews';
import FacebookIcon from '@mui/icons-material/Facebook';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import CppIcon from './CplusplusPlain';
import JavaIcon from './JavaPlainWordmark';
import ScalaIcon from './Scala';
import KotlinIcon from './Kotlin';
import AngularIcon from './AngularjsPlainWordmark';
import JavaScriptIcon from './JavascriptPlain';
import MongoDBIcon from './MongodbPlainWordmark';
import MySQLIcon from './MysqlPlainWordmark';
import NodejsIcon from './NodejsPlainWordmark';
import PHPIcon from './PhpPlain';
import ReactIcon from './ReactOriginalWordmark';
import TypeScriptIcon from './TypescriptPlain';
import GraphQLIcon from './Graphql';
import TerraformIcon from './Terraform';
import PostgresIcon from './Postgresql';
import KubernetesIcon from './Kubernetes';
// ICONS END


const Icons = {
  email: MailIcon,
  facebook: FacebookIcon,
  twitter: Twitter,
  github: GitHubIcon,
  linkedin: LinkedInIcon,
  projectSection: ComputerIcon,
  aboutSection: InfoIcon,
  reviewSection: ReviewsIcon,
  cpp: CppIcon,
  java: JavaIcon,
  typescript: TypeScriptIcon,
  javascript: JavaScriptIcon,
  mysql: MySQLIcon,
  php: PHPIcon,
  mongodb: MongoDBIcon,
  nodejs: NodejsIcon,
  react: ReactIcon,
  angular: AngularIcon,
  graphql: GraphQLIcon,
  helpoutline: HelpOutlineIcon,
  map: MapIcon,
  code: CodeIcon,
  link: LinkIcon,
  web: WebIcon,
  security: SecurityIcon,
  energy: EnergySavingsLeafIcon,
  smartToy: SmartToyIcon,
  videoGame: VideogameAssetIcon,
  timer: TimerIcon,
  app: AppShortcutIcon,
  scala: ScalaIcon,
  kotlin: KotlinIcon,
  schedule: ScheduleIcon,
  tools: HandymanIcon,
  terraform: TerraformIcon,
  postgresql: PostgresIcon,
  kubernetes: KubernetesIcon,
  cv: Description,
};

export type IconKey = keyof typeof Icons;

export const getIcon = (key: IconKey, className?: string): ReactElement => {
  const IconComponent = Icons[key];
  if (IconComponent) {
    return <IconComponent className={className} />;
  }
  return <span>Missing icon: {key}</span>;
};
