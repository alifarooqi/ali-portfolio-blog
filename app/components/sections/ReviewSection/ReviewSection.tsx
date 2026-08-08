"use client";

import React, { forwardRef, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import RateReviewIcon from "@mui/icons-material/RateReview";
import Section from "../../Section/Section";
import SectionConfig from "../../../config/SectionConfig";
import MotionDiv from "../../animaiton/MotionDiv";
import { useCursorMotionGate } from "../../animaiton/useCursorMotionGate";
import { getIcon } from "../../icons/Icons";
import { zoomIn } from "../../animaiton/presets";
import ReviewsConfig, { Review } from "../../../config/ReviewsConfig";
import "./ReviewSection.scss";

const reviewSectionConfig = SectionConfig.find((section) => section.key === "review")!;

const MAX_TILT = 6; // degrees

/** First letters of the first two whitespace-separated tokens. */
function initialsOf(name: string): string {
  const tokens = name.trim().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return "?";
  if (tokens.length === 1) return tokens[0].slice(0, 1).toUpperCase();
  return (tokens[0].slice(0, 1) + tokens[1].slice(0, 1)).toUpperCase();
}

/**
 * Glass testimonial card with an optional cursor-driven 3D tilt. Tilt is
 * gated on fine-pointer + no-reduced-motion; when disabled the card renders
 * static with only the CSS hover lift.
 */
function ReviewCard({ review, tilt }: { review: Review; tilt: boolean }) {
  const ref = useRef<HTMLDivElement>(null);

  // Pointer position as a 0..1 fraction of the card, spring-smoothed so the
  // tilt lags slightly and feels weighted rather than twitchy.
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 200, damping: 18 });
  const sy = useSpring(py, { stiffness: 200, damping: 18 });

  const rotateY = useTransform(sx, [0, 1], [-MAX_TILT, MAX_TILT]);
  const rotateX = useTransform(sy, [0, 1], [MAX_TILT, -MAX_TILT]);

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
  };

  const handleLeave = () => {
    px.set(0.5);
    py.set(0.5);
  };

  const { reviewer } = review;
  const initials = initialsOf(reviewer.name);

  return (
    <motion.div
      ref={ref}
      className="review-card"
      style={
        tilt
          ? { rotateX, rotateY, transformPerspective: 900 }
          : undefined
      }
      onPointerMove={tilt ? handleMove : undefined}
      onPointerLeave={tilt ? handleLeave : undefined}
    >
      <span className="review-card__quote-mark" aria-hidden="true">
        {getIcon("formatQuote")}
      </span>

      <blockquote className="review-card__body">{review.quote}</blockquote>

      {review.footnote && <p className="review-card__footnote">{review.footnote}</p>}

      <div className="review-card__footer">
        <span className="review-avatar" aria-hidden="true">
          {initials}
        </span>
        <span className="review-attribution">
          <span className="review-attribution__name">{reviewer.name}</span>
          <span className="review-attribution__meta">
            {reviewer.title} · {reviewer.company}
          </span>
        </span>
      </div>
    </motion.div>
  );
}

const ReviewSection = forwardRef<HTMLDivElement>((_, ref) => {
  const tiltEnabled = useCursorMotionGate();

  return (
    <Section ref={ref} sectionConfig={reviewSectionConfig}>
      <h4 className="reviews-intro">
        <RateReviewIcon /> What do others say?
      </h4>
      <div className="reviews-grid">
        {ReviewsConfig.reviews.map((review, i) => (
          <MotionDiv
            key={review.reviewer.name}
            variants={zoomIn}
            delay={i * 0.12}
            className="reviews-grid__cell"
          >
            <ReviewCard review={review} tilt={tiltEnabled} />
          </MotionDiv>
        ))}
      </div>
    </Section>
  );
});

ReviewSection.displayName = "ReviewSection";

export default ReviewSection;
