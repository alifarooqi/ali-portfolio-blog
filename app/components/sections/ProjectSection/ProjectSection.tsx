import React, { forwardRef } from "react";

import Section from "../../Section/Section";
import { getIcon } from "../../icons/Icons";
import CircleButton from "../../CircleButton/CircleButton";
import SectionConfig from "../../../config/SectionConfig";
import Projects from "./Projects";
import "./ProjectSection.scss";
import MotionDiv from "../../animaiton/MotionDiv";
import { slideInRight } from "../../animaiton/presets";

const projectSectionConfig = SectionConfig.find((section) => section.key === "projects")!;

const ProjectSection = forwardRef<HTMLDivElement>((_, ref) => (
  <Section ref={ref} sectionConfig={projectSectionConfig} extraClass="project-section">
    {Projects.map((project, index) => (
      <MotionDiv variants={slideInRight} key={"project-" + index}>
        <h3 className="project-heading">
          {project.icon} {project.name}
        </h3>

        <h4 className="project-duration">
          {getIcon("schedule")}
          <em>{project.duration}</em>
        </h4>

        <p className="project-description">{project.description}</p>

        <div className="project-links-container">
          {project.links.map((link, linkIndex) => (
            <CircleButton
              key={"project-link-" + index + linkIndex}
              link={link.link}
              target="_blank"
              tooltip={link.tooltip}
            >
              {link.icon}
            </CircleButton>
          ))}
        </div>
      </MotionDiv>
    ))}
  </Section>
));

ProjectSection.displayName = "ProjectSection";

export default ProjectSection;
