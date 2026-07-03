// =============================================================
// MODULE · Contact / quote form (validation + submit UX)
// =============================================================
import { $, $$, on } from '../utils/dom.js';

export function initForms() {
  // Initialise every quote form on the page (contact section + modal).
  $$('.js-quote-form').forEach(setupForm);
}

function setupForm(form) {
  const status = $('.form__status', form);
  const submitBtn = $('button[type="submit"]', form);

  const showError = (field, message) => {
    field.classList.add('has-error');
    const err = field.querySelector('.field__error');
    if (err && message) err.textContent = message;
    const control = field.querySelector('.field__control');
    if (control) control.setAttribute('aria-invalid', 'true');
  };

  const clearError = (field) => {
    field.classList.remove('has-error');
    const control = field.querySelector('.field__control');
    if (control) control.removeAttribute('aria-invalid');
  };

  const validate = () => {
    let valid = true;
    let firstInvalid = null;

    $$('.field', form).forEach((field) => {
      const control = field.querySelector('.field__control');
      if (!control || !control.hasAttribute('required')) return clearError(field);

      const value = control.value.trim();
      let message = '';

      if (!value) {
        message = 'This field is required.';
      } else if (control.type === 'email' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)) {
        message = 'Please enter a valid email address.';
      } else if (control.type === 'tel' && !/^[\d\s+()-]{8,}$/.test(value)) {
        message = 'Please enter a valid phone number.';
      }

      if (message) {
        showError(field, message);
        valid = false;
        if (!firstInvalid) firstInvalid = control;
      } else {
        clearError(field);
      }
    });

    if (firstInvalid) firstInvalid.focus();
    return valid;
  };

  // Validate a field on blur (not on every keystroke)
  $$('.field__control', form).forEach((control) => {
    on(control, 'blur', () => {
      const field = control.closest('.field');
      if (field && field.classList.contains('has-error')) validate();
    });
  });

  on(form, 'submit', async (e) => {
    e.preventDefault();
    if (status) status.className = 'form__status';

    if (!validate()) {
      if (status) {
        status.textContent = 'Please fix the highlighted fields and try again.';
        status.classList.add('is-error');
      }
      return;
    }

    // Simulated async submit — wire to real endpoint here.
    if (submitBtn) submitBtn.classList.add('is-loading');
    try {
      await new Promise((res) => setTimeout(res, 1200));
      form.reset();
      if (status) {
        status.textContent =
          "Thanks — we've received your request. Our team will call you within one business day.";
        status.classList.add('is-success');
      }
    } catch (err) {
      if (status) {
        status.textContent = 'Something went wrong. Please call us on 1300 000 000.';
        status.classList.add('is-error');
      }
    } finally {
      if (submitBtn) submitBtn.classList.remove('is-loading');
    }
  });
}
