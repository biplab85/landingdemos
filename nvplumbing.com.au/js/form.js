// ─────────────────────────────────────────────────────────────
// Designed & developed by
// Biplab Kumar Paul — Web Designer & Developer
// Mobile: 01735 927356
// Email:  biplab.cse.85@gmail.com
// ─────────────────────────────────────────────────────────────

export function initForm() {
  const form = document.getElementById('quote-form');
  if (!form) return;

  const success = form.querySelector('.form-success');

  const setError = (field, msg) => {
    const input = form.querySelector(`#${field}`);
    const slot = form.querySelector(`.error-msg[data-for="${field}"]`);
    if (!input || !slot) return;
    if (msg) {
      input.classList.add('is-invalid');
      slot.textContent = msg;
    } else {
      input.classList.remove('is-invalid');
      slot.textContent = '';
    }
  };

  const validate = () => {
    let ok = true;
    const name = form.querySelector('#f-name').value.trim();
    const phone = form.querySelector('#f-phone').value.trim();
    const email = form.querySelector('#f-email').value.trim();
    const service = form.querySelector('#f-service').value;

    if (!name) { setError('f-name', 'Please tell us your name'); ok = false; } else setError('f-name', '');
    if (!phone || phone.replace(/\D/g, '').length < 8) { setError('f-phone', 'A phone number we can call you back on'); ok = false; } else setError('f-phone', '');
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('f-email', 'That email doesn\'t look right'); ok = false; } else setError('f-email', '');
    if (!service) { setError('f-service', 'Pick a service so we know who to send'); ok = false; } else setError('f-service', '');
    return ok;
  };

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!validate()) return;

    // Front-end only: in production this would POST to a handler.
    success.classList.add('is-visible');
    form.querySelector('button[type="submit"]').setAttribute('disabled', 'true');
    setTimeout(() => {
      success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 50);
  });

  form.querySelectorAll('input, select, textarea').forEach(el => {
    el.addEventListener('input', () => {
      if (el.classList.contains('is-invalid')) {
        const id = el.id;
        const slot = form.querySelector(`.error-msg[data-for="${id}"]`);
        el.classList.remove('is-invalid');
        if (slot) slot.textContent = '';
      }
    });
  });
}
