import { IconKey } from "app/components/icons/Icons";

interface SocialLink {
  name: string;
  link: string;
  iconKey?: IconKey;
}

interface SignatureConfig {
  viewBox: string;
  /** Empty string disables the SVG signature — TopSection and the OG card
   *  skip rendering it. Leave blank unless you've exported an SVG path of
   *  your signature. */
  signaturePathD: string;
}

interface CommonConfigType {
  // Identity
  name: string;
  /** Short display name — used in the PWA webmanifest and other tight spaces. */
  shortName: string;
  /** One-line role, e.g. "Software Engineer". Used in JSON-LD and the OG card. */
  role: string;
  /** "City, Country" or similar. Empty string hides it. */
  location: string;

  // Hero (TopSection)
  heroImage: string;
  heroImageAlt: string;

  // Signature SVG (optional). TopSection animates the stroke-dasharray on this
  // path; if `signaturePathD` is empty, the signature is not rendered.
  signature: SignatureConfig;

  // Typewriter taglines in the hero. Each is shown for ~2s, then the next.
  taglines: string[];

  // About the writer (rendered at the bottom of every blog post).
  avatarImage: string;
  avatarImageAlt: string;
  writerBio: string;

  // Contact section
  email: string;
  emailSubject: string;
  emailBody: string;
  /** Shown in the Contact section — confirm wording before relying on it. */
  availability: string;

  // SEO
  /** og:site_name and PWA display label. */
  siteName: string;
  ogTitle: string;
  ogDescription: string;
  ogKeywords: string[];
  ogImageAlt: string;
  /** Default OG card title rendered by app/og/route.tsx. */
  ogFallbackTitle: string;
  /** Default OG card subtitle rendered by app/og/route.tsx. */
  ogFallbackSubtitle: string;
  /** Last-resort canonical site URL when no env var is set (dev / CI). */
  siteUrlFallback: string;

  // Social links — rendered in the hero, footer, and as the Contact CV link.
  social: SocialLink[];
}

/**
 * Resolve a social entry's link by its iconKey — the single lookup every
 * surface should use (hero buttons, footer, contact CV link), so there is
 * one place that knows how entries are keyed.
 */
export const getSocialLink = (key: IconKey): string | undefined =>
  CommonConfig.social.find((s) => s.iconKey === key)?.link;

const signature: SignatureConfig = {
  viewBox: "0 0 434 365",
  signaturePathD:
    "M123.947 44.0071C123.947 45.8596 129.44 63.538 140.427 97.0421C156.907 147.298 163.409 167.217 176.407 207.049C189.405 246.881 206.881 299.532 228.862 365.004H248.829L125.801 0H122.089L0 365.004H19.0314L123.947 44.0071ZM115.592 261.242H98.882L126.732 364.996H143.446L115.592 261.242ZM321.5 216L321 52.5H336.5V40.5H309.176V202L321.5 216ZM433.123 12.9692V0.00432162H309.176V12.9692H433.123ZM332 204H367V216H332V204ZM321.215 241V361.035H309.215V228L321.215 241Z",
};

const CommonConfig: CommonConfigType = {
  name: "Ali Farooqi",
  shortName: "Ali",
  role: "Software Engineer",
  location: "China · Greater Bay Area",

  heroImage: "/images/faceshot.webp",
  heroImageAlt: "Ali Farooqi portrait",

  signature,

  taglines: [
    "Software Engineer",
    "Software Developer",
    "Cloud-Native Builder",
    "Open Source Contributor",
    "Tech Enthusiast",
  ],

  avatarImage: "/images/ali-avatar.webp",
  avatarImageAlt: "Ali Farooqi",
  writerBio:
    "Ali is a software engineer based in Hong Kong who builds cloud-powered, high-performance web apps. He writes about React, Next.js, DevOps, SEO, and building modern portfolios that scale. When not coding, he's probably hiking mountains or testing new cloud infra ideas.",

  email: "m.ali_farooqi@hotmail.com",
  emailSubject: "Reaching out from your portfolio",
  emailBody: "Hi Ali,\n\nI found your portfolio and wanted to connect about ",
  availability: "Available for new opportunities",

  siteName: "Ali Farooqi Portfolio",
  ogTitle: "Ali Farooqi | Software Engineer | China & Greater Bay Area",
  ogDescription:
    "Ali Farooqi is a software engineer focused on cloud computing, IoT, and infrastructure strategy in China and the Greater Bay Area. View his projects, publications, and contact details.",
  ogKeywords: [
    "Ali Farooqi",
    "cloud engineer China",
    "IoT expert GBA",
    "cloud infrastructure China",
    "software engineer Hong Kong",
    "backend engineer China",
    "Greater Bay Area tech consultant",
  ],
  ogImageAlt: "Ali Portfolio Preview",
  ogFallbackTitle: "Ali Farooqi | Software Engineer | China & Greater Bay Area",
  ogFallbackSubtitle: "Cloud · IoT · Infrastructure",
  siteUrlFallback: "https://alifarooqi.vercel.app",

  social: [
    {
      name: "GitHub",
      link: "https://github.com/alifarooqi",
      iconKey: "github",
    },
    {
      name: "LinkedIn",
      link: "https://linkedin.com/in/ali-farooqi",
      iconKey: "linkedin",
    },
    {
      name: "Medium",
      link: "https://medium.com/@ali_farooqi",
      iconKey: "medium",
    },
    {
      name: "Email",
      link: "mailto:m.ali_farooqi@hotmail.com",
      iconKey: "email",
    },
    {
      name: "CV",
      link: "https://drive.google.com/file/d/1NtC22cVw6pDmggtAIOqbKQxPevvWRIrX/view?usp=sharing",
      iconKey: "cv",
    },
  ],
};

export default CommonConfig;
