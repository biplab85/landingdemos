// =============================================================
// MODULE · Header — sticky state, mobile drawer, mega menu, bottom bar
// =============================================================

export function initHeader() {
  const header = document.querySelector('[data-header]');
  const burger = document.querySelector('[data-burger]');
  const drawer = document.querySelector('[data-drawer]');
  const scrim = document.querySelector('[data-scrim]');
  const closeBtn = document.querySelector('[data-drawer-close]');
  const bottomBar = document.querySelector('[data-bottom-bar]');
  const body = document.body;

  // ---- Sticky / scrolled state ----
  if (header) {
    const setScrolled = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 24);
      if (bottomBar) bottomBar.classList.toggle('is-visible', window.scrollY > 320);
    };
    setScrolled();
    window.addEventListener('scroll', setScrolled, { passive: true });
  }

  // ---- Mobile drawer ----
  const openDrawer = () => {
    drawer?.classList.add('is-open');
    scrim?.classList.add('is-open');
    burger?.setAttribute('aria-expanded', 'true');
    drawer?.setAttribute('aria-hidden', 'false');
    body.classList.add('is-locked');
  };
  const closeDrawer = () => {
    drawer?.classList.remove('is-open');
    scrim?.classList.remove('is-open');
    burger?.setAttribute('aria-expanded', 'false');
    drawer?.setAttribute('aria-hidden', 'true');
    body.classList.remove('is-locked');
  };

  burger?.addEventListener('click', () => {
    const open = drawer?.classList.contains('is-open');
    open ? closeDrawer() : openDrawer();
  });
  closeBtn?.addEventListener('click', closeDrawer);
  scrim?.addEventListener('click', closeDrawer);
  drawer?.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeDrawer));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDrawer();
  });

  // ---- Desktop mega menu ----
  const megaToggles = document.querySelectorAll('[data-mega-toggle]');
  megaToggles.forEach((toggle) => {
    const wrapper = toggle.closest('[data-mega]');
    const menu = wrapper?.querySelector('[data-mega-menu]');
    if (!menu) return;

    let closeTimer;
    const open = () => {
      clearTimeout(closeTimer);
      menu.classList.add('is-open');
      toggle.setAttribute('aria-expanded', 'true');
    };
    const close = () => {
      clearTimeout(closeTimer);
      menu.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    };
    // Small grace delay before closing so the cursor can travel from the
    // parent link into the submenu without it disappearing.
    const scheduleClose = () => {
      clearTimeout(closeTimer);
      closeTimer = setTimeout(close, 220);
    };

    wrapper.addEventListener('mouseenter', open);
    wrapper.addEventListener('mouseleave', scheduleClose);
    // On hover-capable (desktop) devices the menu opens on hover, so a click on
    // the parent link should navigate to the Services page as normal. Only on
    // touch devices (no hover) do we intercept the first tap to reveal the menu.
    const canHover = window.matchMedia('(hover: hover)').matches;
    toggle.addEventListener('click', (e) => {
      if (canHover) return; // allow default navigation to services.html
      if (!menu.classList.contains('is-open')) {
        e.preventDefault();
        open();
      }
    });
    document.addEventListener('click', (e) => {
      if (!wrapper.contains(e.target)) close();
    });
  });
}
