"use client";

import React, { ReactNode, ReactElement, forwardRef, useRef, useEffect } from 'react';
import { motion, useInView, Variants } from 'motion/react'
import './Section.scss';
import MotionDiv from '../animaiton/MotionDiv';
import { slideInLeft, slideInRight } from '../animaiton/presets';
import { getIcon, IconKey } from '../icons/Icons';

interface SectionProps {
  sectionHeader: string;
  headerIconKey: IconKey;
  isReversed?: boolean; // Optional prop to reverse the section layout
  extraClass?: string;
  children?: ReactNode;
}

const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } }, // delay between each child animation
}


const Section = forwardRef<HTMLDivElement, SectionProps>(
  ({ sectionHeader, headerIconKey, extraClass = '', children, isReversed = false }, ref) => {
    const internalRef = useRef<HTMLDivElement>(null);
    const innerDivRef = useRef<HTMLDivElement>(null);

    // Combine forwarded ref and internal ref
    useEffect(() => {
      if (!ref) return;
      if (typeof ref === 'function') {
        ref(internalRef.current);
      } else {
        ref.current = internalRef.current;
      }
    }, [ref]);

    
    const isInView = useInView(internalRef, { amount: 0.2, once: true })
    const isCurrentlyInView = useInView(internalRef, { amount: 0.5 })

    useEffect(() => {
      if (!innerDivRef.current) return;
      const ACTIVE_CLASS = 'section-active';
      const isActive = innerDivRef.current.classList.contains(ACTIVE_CLASS);
      
      if (!isActive && isCurrentlyInView) {
        document.querySelectorAll(`.${ACTIVE_CLASS}`).forEach(e => e.classList.remove(ACTIVE_CLASS));
        innerDivRef.current?.classList.add(ACTIVE_CLASS);
      } else if (isActive && !isCurrentlyInView) {
        innerDivRef.current?.classList.remove(ACTIVE_CLASS);
      }
    }, [isCurrentlyInView]);

    return (
    <motion.section 
      className={`section-wrapper ${extraClass ? extraClass : ''}`} 
      ref={internalRef}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={staggerContainer}
    >
      <div className={`section${isReversed ? ' section-reverse' : '' }`} ref={innerDivRef}>
        <h2 className="section-header">
          {getIcon(headerIconKey, 'section-header-icon')}
          {sectionHeader}
        </h2>
        <MotionDiv variants={isReversed ? slideInLeft : slideInRight} className="section-content">
          {children}
        </MotionDiv>
      </div>
    </motion.section>
  )
}
);

Section.displayName = 'Section';

export default Section;