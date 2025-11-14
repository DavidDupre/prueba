export function scrollToTop(delay = 200) {
  setTimeout(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, delay);
}
