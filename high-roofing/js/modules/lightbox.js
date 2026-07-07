// Fancybox gallery lightbox. No-op if Fancybox absent.
export function init() {
  const Fancybox = window.Fancybox;
  if (!Fancybox) return;

  Fancybox.bind('[data-fancybox="gallery"]', {
    Toolbar: {
      display: {
        left: ["infobar"],
        middle: [],
        right: ["slideshow", "thumbs", "close"],
      },
    },
    Thumbs: { type: "classic" },
  });
}
