import { effect } from "./core";

let CURRENT = null;

export const view = (name, children) => {
  const prev = CURRENT;
  const el = (CURRENT = document.createElement(name));
  if (typeof children === "function") children();
  else if (children !== undefined) el.appendChild(document.createTextNode(`${children}`));
  prev.appendChild(el);
  CURRENT = prev;
  const handler = {
    get(_, key) {
      return (value) => {
        if (key === "style") {
          for (const s of Object.entries(value)) {
            if (el.style[s[0]] !== s[1]) el.style[s[0]] = s[1];
          }
          return target;
        }
        if (/^on/.test(key)) {
          el.addEventListener(key.slice(2), value);
          return target;
        }
        if (key in document.body.style) {
          if (typeof value !== "function") el.style[key] = value;
          else effect(() => (el.style[key] = value()));
          return target;
        }
      };
    },
  };
  const target = new Proxy({}, handler);
  return target;
};

export const text = (value) => {
  const t = document.createTextNode("");
  if (typeof value === "function") {
    effect(() => (t.textContent = `${value()}`));
  } else if (value !== undefined) t.textContent = `${value}`;
  CURRENT.appendChild(t);
};

export const render = (Component, target) => {
  const prev = CURRENT;
  CURRENT = target;
  Component();
  CURRENT = prev;
};
