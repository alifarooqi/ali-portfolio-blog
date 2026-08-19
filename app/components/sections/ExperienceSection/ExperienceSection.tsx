import React, { forwardRef } from "react";
import Section from "../../Section/Section";
import SectionConfig from "../../../config/SectionConfig";
import ExperienceConfig from "../../../config/ExperienceConfig";
import MotionDiv from "../../animaiton/MotionDiv";
import { slideInLeft, slideInRight } from "../../animaiton/presets";
import { getIcon, getIconLabel } from "../../icons/Icons";
import "./ExperienceSection.scss";

const experienceSectionConfig = SectionConfig.find((section) => section.key === "experience")!;

/**
 * Work-history timeline. Single rail on mobile (line + dots on the left,
 * cards to the right); center rail with alternating cards on desktop.
 * Entry data lives in ExperienceConfig.
 */
const ExperienceSection = forwardRef<HTMLDivElement>((_, ref) => (
  <Section ref={ref} sectionConfig={experienceSectionConfig} extraClass="experience-section">
    <div className="experience-timeline">
      {ExperienceConfig.map((entry, i) => (
        <MotionDiv
          key={`${entry.org}-${entry.period}`}
          variants={i % 2 === 0 ? slideInLeft : slideInRight}
          className="experience-timeline__item"
          delay={i * 0.1}
        >
          <span className="experience-timeline__dot" aria-hidden="true" />
          <article className="experience-timeline__card">
            <span className="experience-timeline__period">{entry.period}</span>
            <h3 className="experience-timeline__role">{entry.role}</h3>
            <p className="experience-timeline__org">
              {entry.org} · {entry.location}
            </p>
            <p className="experience-timeline__description">{entry.description}</p>
            <ul className="experience-timeline__tech">
              {entry.tech.map((key) => (
                <li key={key} className="experience-timeline__chip">
                  {getIcon(key)}
                  <span>{getIconLabel(key)}</span>
                </li>
              ))}
            </ul>
          </article>
        </MotionDiv>
      ))}
    </div>
  </Section>
));

ExperienceSection.displayName = "ExperienceSection";

export default ExperienceSection;
