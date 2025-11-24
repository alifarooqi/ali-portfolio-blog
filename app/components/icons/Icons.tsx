import React, { ReactElement } from 'react';

// ICONS
import SvgIcon from '@mui/material/SvgIcon';
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
import { ReactComponent as FacebookIcon } from './facebook.svg';
import { ReactComponent as GitHubIcon } from './github.svg';
import { ReactComponent as LinkedInIcon } from './linkedin.svg';
import { ReactComponent as CppIcon } from './cplusplus-plain.svg';
import { ReactComponent as JavaIcon } from './java-plain-wordmark.svg';
import { ReactComponent as ScalaIcon } from './scala.svg';
import { ReactComponent as KotlinIcon } from './kotlin.svg';
import { ReactComponent as AngularIcon } from './angularjs-plain-wordmark.svg';
import { ReactComponent as JavaScriptIcon } from './javascript-plain.svg';
import { ReactComponent as MongoDBIcon } from './mongodb-plain-wordmark.svg';
import { ReactComponent as MySQLIcon } from './mysql-plain-wordmark.svg';
import { ReactComponent as NodejsIcon } from './nodejs-plain-wordmark.svg';
import { ReactComponent as PHPIcon } from './php-plain.svg';
import { ReactComponent as ReactIcon } from './react-original-wordmark.svg';
import { ReactComponent as TypeScriptIcon } from './typescript-plain.svg';
import { ReactComponent as GraphQLIcon } from './graphql.svg';
import { ReactComponent as TerraformIcon } from './terraform.svg';
import { ReactComponent as PostgresIcon } from './postgresql.svg';
import { ReactComponent as KubernetesIcon } from './kubernetes.svg';
// ICONS END


type IconsType = Record<string, ReactElement>;

const Icons: IconsType = {
  email: <MailIcon />,
  facebook: <SvgIcon component={FacebookIcon} />,
  twitter: <Twitter />,
  github: <SvgIcon component={GitHubIcon} stroke="currentColor" strokeWidth={2} style={{ fill: 'none' }} />,
  linkedin: <SvgIcon component={LinkedInIcon} />,
  projectSection: <ComputerIcon />,
  aboutSection: <InfoIcon />,
  reviewSection: <ReviewsIcon />,
  cpp: <SvgIcon component={CppIcon} viewBox="0 0 128 128" fontSize="large" title="C++" />,
  java: <SvgIcon component={JavaIcon} viewBox="0 0 128 128" fontSize="large" title="Java" />,
  typescript: <SvgIcon component={TypeScriptIcon} viewBox="0 0 128 128" fontSize="large" title="TypeScript" />,
  javascript: <SvgIcon component={JavaScriptIcon} viewBox="0 0 128 128" fontSize="large" title="JavaScript" />,
  mysql: <SvgIcon component={MySQLIcon} viewBox="0 0 128 128" fontSize="large" title="MySQL" />,
  php: <SvgIcon component={PHPIcon} viewBox="0 0 128 128" fontSize="large" title="PHP" />,
  mongodb: <SvgIcon component={MongoDBIcon} viewBox="0 0 128 128" fontSize="large" title="MongoDB" />,
  nodejs: <SvgIcon component={NodejsIcon} viewBox="0 0 128 128" fontSize="large" title="Node.js" />,
  react: <SvgIcon component={ReactIcon} viewBox="0 0 128 128" fontSize="large" title="React" />,
  angular: <SvgIcon component={AngularIcon} viewBox="0 0 128 128" fontSize="large" title="Angular" />,
  graphql: <SvgIcon component={GraphQLIcon} viewBox="0 0 400 400" fontSize="large" title="GraphQL" />,
  helpoutline: <HelpOutlineIcon />,
  map: <MapIcon />,
  code: <CodeIcon />,
  link: <LinkIcon />,
  web: <WebIcon />,
  security: <SecurityIcon />,
  energy: <EnergySavingsLeafIcon/>,
  smartToy: <SmartToyIcon/>,
  videoGame: <VideogameAssetIcon/>,
  timer: <TimerIcon/>,
  app: <AppShortcutIcon />,
  scala: <SvgIcon component={ScalaIcon} viewBox="0 0 590 270" fontSize="large" title="Scala" />,
  kotlin: <SvgIcon component={KotlinIcon} viewBox="0 0 24 24" fontSize="large" title="Kotlin" />,
  schedule: <ScheduleIcon />,
  tools: <HandymanIcon />,
  terraform: <SvgIcon component={TerraformIcon} viewBox="0 0 1024 1024" fontSize="large" title="Terraform" />,
  postgresql: <SvgIcon component={PostgresIcon} viewBox='0 0 128 128' fontSize="large" title="Postgres" />,
  kubernetes: <SvgIcon component={KubernetesIcon} viewBox='0 0 16 16' fontSize="large" title="Kubernetes" />,
  cv: <Description />,
};

export type IconKey = keyof typeof Icons;

export const getIcon = (key: IconKey): ReactElement => {
  return Icons[key] || <span>Missing icon: {key}</span>;
};
