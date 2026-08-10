/**
 * Smooth-scroll so the element with the given id is centered vertically in
 * the viewport (or top-aligned if it's taller than the viewport). Used by
 * home-page section navigation. Respects Lenis / native smooth scroll.
 */
export function scrollToSection(sectionId: string): void {
  const element = document.getElementById(sectionId);
  if (!element) return;

  const offset =
    window.innerHeight > element.offsetHeight
      ? (window.innerHeight - element.offsetHeight) / 2
      : 0;
  window.scrollTo({
    top: element.offsetTop - offset,
    left: 0,
    behavior: "smooth",
  });
}
