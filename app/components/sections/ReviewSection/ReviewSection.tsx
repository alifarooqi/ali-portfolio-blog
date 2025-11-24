import React, { forwardRef } from 'react';
import RateReviewIcon from '@mui/icons-material/RateReview';
import Section from '../../Section/Section';
import SectionConfig from "../../../config/SectionConfig";
import Quote from './Quote';
import './ReviewSection.scss';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const ReviewSectionConfig = SectionConfig.find(section => section.link === 'review')!;


const ReviewSection = forwardRef<HTMLDivElement>((_, ref) => (
    <Section
        ref={ref}
        sectionHeader={ReviewSectionConfig.name}
        headerIcon={ReviewSectionConfig.headerIcon}
        extraClass="review-section"
    >
        <h4 style={{ fontSize: '2em' }}><RateReviewIcon /> What do others say?</h4>

            <p>
            <Quote />
            <br />
            I had the pleasure of working alongside Ali at KM.ON GmbH as Project Manager on several shared projects and initiatives where his broad technical expertise, availability and reliability stood out. Even when managing multiple complex projects, he consistently navigated challenges with confidence and ensured smooth progress, making him an essential asset to our work.
            </p>
            <p>Ali has a remarkable talent for remaining calm under pressure and maintaining a focused, solution-driven mindset, making him someone the entire team could rely on. Beyond his professional expertise, he brought a positive energy to the workplace, making collaboration not only productive but genuinely enjoyable. His approachable nature fostered a supportive environment and his contributions were invaluable to our collective success.</p>
            <p>It was truly a pleasure to work with Ali and I am confident that any team would greatly benefit from his expertise, dedication and exceptional professionalism.</p>
            <p className='review-signature'>
                <span className='reviewer-name'>Daniela Baretti</span>
                <br />
                Junior Project Manager
                <br />
                KM.ON GmbH
            </p>

            <p>
            <Quote />
            <br />
            Wish to recognize Muhammad Ali Farooqi and Amsal Lakhani for supporting WeDerm Health in developing our prototype in a tight timeframe. Also credits to our professional UX designer Blair KIM for everything visual.
            </p>
            <p>...If anyone is looking for software developers, do get connected with them!</p>
            <p className='review-signature'>
                <span className='reviewer-name'>Harrison Li 李健彰</span>
                <br />
                Co-Founder & CEO
                <br />
                WeDerm Health
            </p>
    </Section>
));

ReviewSection.displayName = "ReviewSection";

export default ReviewSection;