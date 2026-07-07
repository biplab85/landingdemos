// Client-side validation for the quote form(s). Static demo — no backend.
import { $$, on } from "../utils/dom.js";

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRe = /^[0-9 ()+\-]{6,}$/;

function validateField(field) {
  const input = field.querySelector("input, select, textarea");
  if (!input) return true;
  let ok = true;
  const val = input.value.trim();

  if (input.required && !val) ok = false;
  else if (input.type === "email" && val && !emailRe.test(val)) ok = false;
  else if (input.dataset.type === "phone" && val && !phoneRe.test(val)) ok = false;

  field.classList.toggle("has-error", !ok);
  return ok;
}

export function init() {
  const forms = $$("form[data-quote-form]");
  if (!forms.length) return;

  forms.forEach((form) => {
    const status = form.querySelector(".quote-form__status");

    form.querySelectorAll(".field").forEach((field) => {
      const input = field.querySelector("input, select, textarea");
      if (input) on(input, "blur", () => validateField(field));
    });

    on(form, "submit", (e) => {
      e.preventDefault();
      let valid = true;
      form.querySelectorAll(".field").forEach((field) => {
        if (!validateField(field)) valid = false;
      });

      if (!valid) {
        if (status) {
          status.textContent = "Please complete the highlighted fields.";
          status.style.color = "#d64545";
        }
        return;
      }

      const btn = form.querySelector('button[type="submit"]');
      if (btn) {
        btn.disabled = true;
        btn.dataset.label = btn.textContent;
        btn.textContent = "Sending…";
      }

      // Simulated success (demo). Replace with real endpoint later.
      setTimeout(() => {
        form.reset();
        if (btn) {
          btn.disabled = false;
          btn.textContent = btn.dataset.label || "Send Request";
        }
        if (status) {
          status.style.color = "";
          status.textContent =
            "Thanks! Your request has been received — we'll call you shortly.";
        }
      }, 900);
    });
  });
}
