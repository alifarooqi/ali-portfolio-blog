import Image from "next/image";
import Link from "next/link";
import CommonConfig from "../config/CommonConfig";

interface Props {
  link?: string;
}

const MEDIUM_BASE_URL =
  CommonConfig.social.find((s) => s.name.toLowerCase() === "medium")?.link ||
  "https://medium.com/@alifarooqi";

export default function AboutWriter({ link }: Props) {
  return (
    <div className="mt-16 border-t pt-10 flex flex-col md:flex-row items-center gap-6">
      {/* Avatar */}
      <Image
        src="/images/ali-avatar.webp"
        alt="Ali Farooqi"
        width={200}
        height={274}
        className="object-cover"
      />

      {/* Text */}
      <div className="flex-1">
        <h2 className="text-xl font-semibold mb-2">About the Writer</h2>
        <p className="leading-relaxed mb-4">
          Ali is a software engineer based in Hong Kong who builds cloud-powered, high-performance
          web apps. He writes about React, Next.js, DevOps, SEO, and building modern portfolios that
          scale. When not coding, he’s probably hiking mountains or testing new cloud infra ideas.
        </p>

        {/* Medium button */}
        <Link
          href={link || MEDIUM_BASE_URL}
          target="_blank"
          className="inline-block bg-[var(--brand-color)] !text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-900 transition duration-300"
        >
          Originally posted on Medium →
        </Link>
      </div>
    </div>
  );
}
