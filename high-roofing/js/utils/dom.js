// Tiny DOM helpers
export const $ = (sel, ctx = document) => ctx.querySelector(sel);
export const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
export const on = (el, evt, cb, opts) => el && el.addEventListener(evt, cb, opts);

export const focusables = (ctx) =>
  $$(
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ctx
  );
