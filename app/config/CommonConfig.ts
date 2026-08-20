import { IconKey } from "app/components/icons/Icons";

interface SocialLink {
  name: string;
  link: string;
  iconKey?: IconKey;
}

interface SignatureConfig {
  viewBox: string;
  signaturePathD: string;
}

interface CommonConfigType {
  name: string;
  taglines: string[];
  signature: SignatureConfig;
  email: string;
  /** Shown in the Contact section — confirm wording before relying on it. */
  location: string;
  /** Availability badge text in the Contact section. */
  availability: string;
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
  signaturePathD: `M123.947 44.0071C123.947 45.8596 129.44 63.538 140.427 97.0421C156.907 147.298 163.409 167.217 176.407 207.049C189.405 246.881 206.881 299.532 228.862 365.004H248.829L125.801 0H122.089L0 365.004H19.0314L123.947 44.0071ZM115.592 261.242H98.882L126.732 364.996H143.446L115.592 261.242ZM321.5 216L321 52.5H336.5V40.5H309.176V202L321.5 216ZM433.123 12.9692V0.00432162H309.176V12.9692H433.123ZM332 204H367V216H332V204ZM321.215 241V361.035H309.215V228L321.215 241Z`,
};

const CommonConfig: CommonConfigType = {
  name: "Ali Farooqi",
  taglines: [
    "Software Engineer",
    "Software Developer",
    "Cloud-Native Builder",
    "Open Source Contributor",
    "Tech Enthusiast",
  ],
  signature,
  email: "m.ali_farooqi@hotmail.com",
  location: "China · Greater Bay Area",
  availability: "Available for new opportunities",
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
