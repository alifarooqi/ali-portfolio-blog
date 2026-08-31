export type Review = {
  /** Testimonial body. Paragraph breaks are represented as \n\n and honored
   * via the CSS `white-space: pre-line` rule on the card body. */
  quote: string;
  /** Optional muted follow-up shown beneath the quote. */
  footnote?: string;
  reviewer: {
    name: string;
    title: string;
    company: string;
  };
};

export type ReviewsConfigType = {
  reviews: Review[];
};

const ReviewsConfig: ReviewsConfigType = {
  reviews: [
    {
      // Daniela Baretti — three paragraphs preserved verbatim.
      quote:
        "I had the pleasure of working alongside Ali at KM.ON GmbH as Project Manager on several shared projects and initiatives where his broad technical expertise, availability and reliability stood out. Even when managing multiple complex projects, he consistently navigated challenges with confidence and ensured smooth progress, making him an essential asset to our work.\n\nAli has a remarkable talent for remaining calm under pressure and maintaining a focused, solution-driven mindset, making him someone the entire team could rely on. Beyond his professional expertise, he brought a positive energy to the workplace, making collaboration not only productive but genuinely enjoyable. His approachable nature fostered a supportive environment and his contributions were invaluable to our collective success.\n\nIt was truly a pleasure to work with Ali and I am confident that any team would greatly benefit from his expertise, dedication and exceptional professionalism.",
      reviewer: {
        name: "Daniela Baretti",
        title: "Project Manager",
        company: "sovanta AG",
      },
    },
    {
      quote:
        "Wish to recognize Muhammad Ali Farooqi and Amsal Lakhani for supporting WeDerm Health in developing our prototype in a tight timeframe. Also credits to our professional UX designer Blair KIM for everything visual.",
      footnote: "If anyone is looking for software developers, do get connected with them!",
      reviewer: {
        name: "Harrison Li 李健彰",
        title: "Co-Founder & CEO",
        company: "WeDerm Health",
      },
    },
    {
      // Husn-e-Rabbi — three paragraphs preserved verbatim.
      quote:
        "I had the pleasure of working with Ali Farooqi, and I found him to be an excellent problem solver with a strong engineering mindset. Whenever he works on a problem, he doesn’t just look for a quick solution; he considers the bigger picture, including security, availability, scalability, maintainability, and the best way to build the application.\n\nAli is also energetic and always willing to explore and adopt new frameworks, technologies, and better approaches. What I particularly appreciate is that he is a collaborative team player who is always ready to support others and contribute toward achieving the team's goals.\n\nIt was a great experience working with him.",
      reviewer: {
        name: "Husn-e-Rabbi",
        title: "DevOps Lead",
        company: "KM.ON Asia",
      },
    },
  ],
};

export default ReviewsConfig;
