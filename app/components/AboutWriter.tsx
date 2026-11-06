"use client";

import Image from "next/image";
import Button from "./Button/Button";
import CommonConfig from "../config/CommonConfig";
import { getIcon } from "./icons/Icons";

interface Props {
  link?: string;
}

// Prefer the Medium entry in CommonConfig.social; fall back to no link if the
// user hasn't configured one. Avoids a stale hardcoded fallback URL.
const mediumLink = CommonConfig.social.find((s) => s.iconKey === "medium")?.link;

export default function AboutWriter({ link }: Props) {
  const mediumHref = link ?? mediumLink;

  return (
    <div className="mt-16 border-t pt-10 flex flex-col md:flex-row items-center gap-6">
      {/* Avatar */}
      <Image
        src={CommonConfig.avatarImage}
        alt={CommonConfig.avatarImageAlt}
        width={200}
        height={274}
        className="object-cover"
      />

      {/* Text */}
      <div className="flex-1">
        <h2 className="text-xl font-semibold mb-2">About the Writer</h2>
        <p className="leading-relaxed mb-4">{CommonConfig.writerBio}</p>

        {mediumHref && (
          <Button href={mediumHref} external icon={getIcon("arrowOutward")} iconPosition="after">
            {link ? "Originally posted on Medium" : "Visit my Medium"}
          </Button>
        )}
      </div>
    </div>
  );
}
