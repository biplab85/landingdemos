// =============================================================
// MODULE · Fancybox (gallery + video)
// Expects global `Fancybox` (loaded via CDN in index.html).
// =============================================================

export function initLightbox() {
  if (typeof window.Fancybox === 'undefined') return;
  window.Fancybox.bind('[data-fancybox]', {
    Hash: false,
    Toolbar: {
      display: { right: ['slideshow', 'thumbs', 'close'] },
    },
    Thumbs: { type: 'classic' },
  });
}
