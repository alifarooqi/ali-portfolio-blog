import { IconKey } from "../components/icons/Icons";

export type AboutStat = { label: string; value: string };

export type AboutConfigType = {
  /** One-paragraph bio shown in the large bento card. */
  bio: string;
  /** Curated stats for the small bento card. Not live-fetched. */
  stats: AboutStat[];
  /** Tech shown in the top marquee (scrolls left → right). */
  programming: IconKey[];
  /** Tech shown in the bottom marquee (scrolls right → left). */
  tools: IconKey[];
};

const AboutConfig: AboutConfigType = {
  bio: "Engineer by trade, bridge-builder by nature — I design secure, scalable platforms and help global tech thrive in the Chinese cloud. Off the clock, you'll find me watching football, probably yelling at the screen like it's a code review :)",
  stats: [
    { label: "Years Experience", value: "8+" },
    { label: "Projects Shipped", value: "12+" },
    { label: "Tech Stack", value: "12" },
    { label: "Blog Posts", value: "10+" },
  ],
  programming: ["java", "cpp", "typescript", "scala", "kotlin", "nodejs", "react"],
  tools: ["graphql", "postgresql", "terraform", "mongodb", "kubernetes"],
};

export default AboutConfig;
