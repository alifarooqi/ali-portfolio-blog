import React, { ReactNode } from "react";
import { getIcon } from "../../icons/Icons";

interface ProjectLink {
  tooltip: string;
  link: string;
  icon: ReactNode;
}

interface Project {
  name: string;
  icon: ReactNode;
  description: React.ReactNode;
  duration: string;
  links: ProjectLink[];
}

const Projects: Project[] = [
  {
    name: "Identity and Access Management",
    icon: getIcon("security"),
    duration: "2020 - 2025",
    description: (
      <>
        An IAM system for a cloud-based IoT solution using <b>Scala</b> and <b>React</b>. The system
        features PKI-based authentication for hardware devices and JWT-based authentication for
        users and services, ensuring secure access control. It also includes a built-in policy
        management system for granular access permissions, enhancing security and simplifying
        management.
      </>
    ),
    links: [],
  },
  {
    name: "Energy Efficiency Solution",
    icon: getIcon("energy"),
    duration: "2023 - 2024",
    description: (
      <>
        A machine energy monitoring dashboard using <b>React</b> and <b>Chart.js</b> for the
        frontend, with a <b>Kotlin</b> backend. The dashboard features real-time monitoring of
        energy usage and historical data analysis, providing interactive charts and visualizations.
        This tool helps users track energy consumption patterns and optimize machinery efficiency.
      </>
    ),
    links: [],
  },
  {
    name: "EczeTrack",
    icon: getIcon("app"),
    duration: "2020",
    description: (
      <>
        A <b>React Native</b> mobile app with <b>NodeJS</b> to track Eczema symptoms in patients,
        designed to help them save time recording lifestyle habits.
      </>
    ),
    links: [
      {
        tooltip: "See source (Frontend)",
        link: "https://github.com/alifarooqi/EczeTrack-Frontend/",
        icon: getIcon("code"),
      },
      {
        tooltip: "See source (Backend)",
        link: "https://github.com/alifarooqi/EczeTrack-Backend/",
        icon: getIcon("code"),
      },
    ],
  },
  {
    name: "Tic Tac Toe",
    icon: getIcon("smartToy"),
    duration: "2017",
    description: "A Tic Tac Toe game with an unbeatible AI Agent.",
    links: [
      {
        tooltip: "See source",
        link: "https://codepen.io/ali-farooqi/pen/RZgExb",
        icon: getIcon("code"),
      },
      {
        tooltip: "See app",
        link: "https://codepen.io/ali-farooqi/full/RZgExb",
        icon: getIcon("link"),
      },
    ],
  },
  {
    name: "Simon Game",
    icon: getIcon("videoGame"),
    duration: "2017",
    description:
      "Brought back the childhood memories with this Simon Game. A simple game where you have to repeat the sequence of colors shown by the game.",
    links: [
      {
        tooltip: "See source",
        link: "https://codepen.io/ali-farooqi/pen/VzXawr",
        icon: getIcon("code"),
      },
      {
        tooltip: "See app",
        link: "https://codepen.io/ali-farooqi/full/VzXawr",
        icon: getIcon("link"),
      },
    ],
  },
  {
    name: "Pomodoro Timer",
    icon: getIcon("timer"),
    duration: "2017",
    description:
      "A Pomodoro Timer to help you focus on your work. It has a simple UI and a timer which will help you focus on your work for 25 minutes and then take a break for 5 minutes.",
    links: [
      {
        tooltip: "See source",
        link: "https://codepen.io/ali-farooqi/pen/YxpVMM",
        icon: getIcon("code"),
      },
      {
        tooltip: "See app",
        link: "https://codepen.io/ali-farooqi/full/YxpVMM",
        icon: getIcon("link"),
      },
    ],
  },
];

export default Projects;
