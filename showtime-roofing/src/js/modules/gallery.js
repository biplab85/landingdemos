// =============================================================
// MODULE · Gallery / lightbox (Fancybox)
// Handles galleries, before/after, videos and inline quote modal.
// =============================================================
import { Fancybox } from '@fancyapps/ui';

export function initGallery() {
  Fancybox.bind('[data-fancybox]', {
    Hash: false,
    Toolbar: {
      display: {
        left: ['infobar'],
        middle: [],
        right: ['slideshow', 'thumbs', 'close'],
      },
    },
    Thumbs: { type: 'classic' },
    Images: { zoom: true },
  });
}
