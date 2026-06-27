// =============================================================
// MODULE · Quote form — client validation + submit UX
// =============================================================

export function initForm() {
  const forms = document.querySelectorAll('[data-form]');
  if (!forms.length) return;

  forms.forEach((form) => {
    const status = form.querySelector('[data-form-status]');

    const showError = (field, message) => {
      const group = field.closest('.form__group');
      const error = group?.querySelector('.form__error');
      if (error) error.textContent = message;
      field.setAttribute('aria-invalid', 'true');
    };
    const clearError = (field) => {
      const group = field.closest('.form__group');
      const error = group?.querySelector('.form__error');
      if (error) error.textContent = '';
      field.removeAttribute('aria-invalid');
    };

    form.querySelectorAll('input, textarea, select').forEach((field) => {
      field.addEventListener('input', () => clearError(field));
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      form.querySelectorAll('[required]').forEach((field) => {
        if (!field.value.trim()) {
          showError(field, 'This field is required.');
          valid = false;
        } else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
          showError(field, 'Please enter a valid email.');
          valid = false;
        }
      });

      if (!valid) {
        if (status) {
          status.textContent = 'Please fix the highlighted fields.';
          status.className = 'form__status is-error';
        }
        return;
      }

      // Demo success — wire to a real endpoint here.
      const btn = form.querySelector('[type="submit"]');
      if (btn) {
        btn.disabled = true;
        btn.dataset.label = btn.textContent;
        btn.textContent = 'Sending…';
      }

      setTimeout(() => {
        if (status) {
          status.textContent = "Thanks! We'll be in touch within one business day.";
          status.className = 'form__status is-success';
        }
        form.reset();
        if (btn) {
          btn.disabled = false;
          btn.textContent = btn.dataset.label || 'Get my free quote';
        }
      }, 900);
    });
  });
}
