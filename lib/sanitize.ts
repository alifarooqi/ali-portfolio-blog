import DOMPurify from "isomorphic-dompurify";

// Allowlist derived from the actual content of lib/medium-feed.json
// (13 tags observed: em, strong, blockquote, h3, h4, p, figcaption, figure,
// img, li, ol, ul, a) plus tags the issue anticipates for future posts
// (h2, pre, code, hr). See lib/sanitize.test.ts for the contract.
const ALLOWED_TAGS = [
  // Structural
  "p",
  "blockquote",
  "hr",
  "figure",
  "figcaption",
  // Headings
  "h2",
  "h3",
  "h4",
  // Lists
  "ul",
  "ol",
  "li",
  // Inline formatting
  "em",
  "strong",
  "code",
  // Code blocks
  "pre",
  // Links + media
  "a",
  "img",
];

// Array form (not the per-tag object form) — DOMPurify's TS types only accept
// this. Functionally equivalent for us since <img> is the only allowlisted tag
// that takes width/height.
const ALLOWED_ATTR = ["href", "src", "alt", "width", "height"];

// Negative lookahead: allow anything EXCEPT dangerous schemes. DOMPurify v3
// applies ALLOWED_URI_REGEXP to ALL attribute values (not just href/src), so
// a positive pattern like `^https?:` would also strip width/height/title text.
// Negative lookahead lets non-URI attrs through while blocking javascript:,
// data:, vbscript:, file:.
const ALLOWED_URI_REGEXP = /^(?!(?:javascript|data|vbscript|file):)/i;

// DOMPurify v3 special-cases data:image/* (including data:image/svg+xml) and
// re-adds it even when ALLOWED_URI_REGEXP would reject. Close that hole with
// an explicit hook. Registered once at module load.
DOMPurify.addHook("afterSanitizeAttributes", (node) => {
  if (node.tagName === "IMG") {
    const src = node.getAttribute("src");
    if (src && /^data:/i.test(src)) {
      node.removeAttribute("src");
    }
  }
});

// DOMPurify v3 keeps these in the default attribute allowlist; we want them
// gone. `style` is the dangerous one (CSS-based XSS via url(javascript:...)).
const FORBID_ATTR = ["style", "class", "title"];

export function sanitizeMediumHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
    ALLOWED_URI_REGEXP,
    FORBID_ATTR,
  });
}
