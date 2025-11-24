import React, { forwardRef } from 'react';
import Section from '../../Section/Section';
import { getIcon } from '../../icons/Icons';
import SectionConfig from '../../../config/SectionConfig';
import './AboutSection.scss';
import MotionDiv from '../../animaiton/MotionDiv';
import { slideInLeft } from '../../animaiton/presets';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const AboutSectionConfig = SectionConfig.find(section => section.link === 'about')!;

const AboutSection = forwardRef<HTMLDivElement>((_, ref) => (
    <Section 
      ref={ref}
      sectionHeader={AboutSectionConfig.name} 
      headerIcon={AboutSectionConfig.headerIcon} 
      isReversed
      extraClass="about-section"
    >
      <h4>
        {getIcon('helpoutline')} Who is this guy?
      </h4>
      
      <p>
        Engineer by trade, bridge-builder by nature — I design secure, scalable platforms and help global tech thrive in the Chinese cloud. Off the clock, you’ll find me watching football, probably yelling at the screen like it’s a code review :)
      </p>

      <h4>{getIcon('code')} Programming</h4>
      <MotionDiv variants={slideInLeft} className="programming-icons">
        {getIcon('java')}
        {getIcon('cpp')}
        {getIcon('typescript')}
        {getIcon('scala')}
        {getIcon('kotlin')}          
        {getIcon('nodejs')}
        {getIcon('react')}
      </MotionDiv>

      <h4>{getIcon('tools')} Tools</h4>
      <MotionDiv variants={slideInLeft}  className="programming-icons">
        {getIcon('graphql')}
        {getIcon('postgresql')}
        {getIcon('terraform')}
        {getIcon('mongodb')}
        {getIcon('kubernetes')}
      </MotionDiv>
    </Section>
));

AboutSection.displayName = 'AboutSection';

export default AboutSection;