import React, { forwardRef } from "react";
import Section from "../../Section/Section";
import { getIcon, IconKey } from "../../icons/Icons";
import SectionConfig from "../../../config/SectionConfig";
import MotionDiv from "../../animaiton/MotionDiv";
import { slideInLeft, slideInRight, zoomIn } from "../../animaiton/presets";
import AboutConfig from "../../../config/AboutConfig";
import "./AboutSection.scss";

const aboutSectionConfig = SectionConfig.find((section) => section.key === "about")!;

/**
 * Marquee row: duplicates the icon list so the CSS translateX(-50%) loop is
 * seamless. Direction is applied via modifier class so the keyframe can be
 * picked per row.
 */
function MarqueeRow({ items, direction }: { items: IconKey[]; direction: "left" | "right" }) {
  const rendered = items.map((key, i) => (
    <span key={`${key}-${i}`} className="about-marquee__item">
      {getIcon(key)}
    </span>
  ));
  return (
    <div className={`about-marquee about-marquee--${direction}`}>
      <div className="about-marquee__track">
        {rendered}
        {rendered}
      </div>
    </div>
  );
}

const AboutSection = forwardRef<HTMLDivElement>((_, ref) => (
  <Section ref={ref} sectionConfig={aboutSectionConfig} isReversed extraClass="about-section">
    <div className="about-bento">
      <MotionDiv variants={slideInRight} className="about-bento__card about-bento__bio">
        <h4>
          {getIcon("helpoutline")} Who is this guy?
        </h4>
        <p>{AboutConfig.bio}</p>
      </MotionDiv>

      <MotionDiv variants={zoomIn} className="about-bento__card about-bento__stats" delay={0.15}>
        {AboutConfig.stats.map((stat) => (
          <div key={stat.label} className="about-bento__stat">
            <span className="about-bento__stat-value">{stat.value}</span>
            <span className="about-bento__stat-label">{stat.label}</span>
          </div>
        ))}
      </MotionDiv>

      <MotionDiv
        variants={slideInLeft}
        className="about-bento__card about-bento__marquee about-bento__marquee--prog"
        delay={0.2}
      >
        <h4>{getIcon("code")} Programming</h4>
        <MarqueeRow items={AboutConfig.programming} direction="left" />
      </MotionDiv>

      <MotionDiv
        variants={slideInLeft}
        className="about-bento__card about-bento__marquee about-bento__marquee--tools"
        delay={0.3}
      >
        <h4>{getIcon("tools")} Tools</h4>
        <MarqueeRow items={AboutConfig.tools} direction="right" />
      </MotionDiv>
    </div>
  </Section>
));

AboutSection.displayName = "AboutSection";

export default AboutSection;
