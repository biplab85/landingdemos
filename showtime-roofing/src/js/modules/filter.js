// =============================================================
// MODULE · Gallery category filter
// =============================================================

export function initFilter() {
  const groups = document.querySelectorAll('[data-filter]');
  if (!groups.length) return;

  groups.forEach((group) => {
    const buttons = group.querySelectorAll('[data-filter-btn]');
    const target = document.querySelector(group.dataset.filter);
    if (!target) return;
    const items = target.querySelectorAll('[data-category]');

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const value = btn.dataset.filterBtn;

        buttons.forEach((b) => b.classList.toggle('is-active', b === btn));

        items.forEach((item) => {
          const match = value === 'all' || item.dataset.category === value;
          item.classList.toggle('is-hidden', !match);
        });
      });
    });
  });
}
