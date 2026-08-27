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
  coverImage: string;
  links: ProjectLink[];
}

const Projects: Project[] = [
  {
    name: "Claude Waiting Room",
    icon: getIcon("smartToy"),
    duration: "2026",
    coverImage: "/images/projects/claude_waiting_room.webp",
    description: (
      <>
        A <b>Claude Code</b> companion that pauses your side activity and snaps tmux focus back
        the moment an agent needs you. Built as a <b>Go</b> IPC daemon + <b>TypeScript</b> monorepo
        (SDK, plugin, activities) talking over a peer-credentialed Unix domain socket.
      </>
    ),
    links: [
      {
        tooltip: "See source",
        link: "https://github.com/alifarooqi/claude-waiting-room",
        icon: getIcon("code"),
      },
    ],
  },
  {
    name: "Antigravity Telegram Bridge",
    icon: getIcon("smartToy"),
    duration: "2025",
    coverImage: "/images/projects/antigravity_telegram_bridge.webp",
    description: (
      <>
        A Python application bridging Telegram with the <b>Google Antigravity SDK</b>, enabling remote interaction and task execution on a local Mac-based agent. Supports multi-session isolation, persistence, and strict security sandboxing for git commands.
      </>
    ),
    links: [
      {
        tooltip: "See source",
        link: "https://github.com/alifarooqi/agy-telegram-bridge",
        icon: getIcon("code"),
      }
    ],
  },
  {
    name: "Identity and Access Management",
    icon: getIcon("security"),
    duration: "2020 - 2025",
    coverImage: "/images/projects/iam_security.webp",
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
    coverImage: "/images/projects/energy_efficiency.webp",
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
    coverImage: "/images/projects/eczetrack.webp",
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
    coverImage: "/images/projects/tic_tac_toe.webp",
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
    coverImage: "/images/projects/simon_game.webp",
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
    coverImage: "/images/projects/pomodoro_timer.webp",
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
