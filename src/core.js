let ACTIVE = null;
const ef = new Set();
const ep = Promise.resolve();

const ce = (fn, cb) => {
  const e = {
    deps: new Set(),
    cb,
    run: () => {
      const prev = ACTIVE;
      ACTIVE = e;
      const v = fn();
      ACTIVE = prev;
      return v;
    },
    stop: () => {
      e.deps.forEach((x) => (console.log(x), x.delete(e)));
      e.deps.clear();
      e.deps = null;
    },
  };
  return e;
};

export const effect = (fn) => {
  const e = ce(fn);
  e.run();
  return e.stop;
};

const track = (es) => {
  if (ACTIVE && !es.has(ACTIVE)) {
    ACTIVE.deps.add(es);
    es.add(ACTIVE);
  }
};

const trigger = (es) => {
  es.forEach((e) => {
    if (e !== ACTIVE) {
      !ef.size &&
        ep.then(() => {
          ef.forEach((x) => x());
          ef.clear();
        });
      ef.add(e.cb || e.run);
    }
  });
};

export const signal = (value) => {
  let v = value;
  let es;
  const get = () => {
    track(es || (es = new Set()));
    return v;
  };
  get.set = (value) => {
    if (v !== value) {
      v = value;
      es && trigger(es);
    }
  };
  get.update = (fn) => {
    get.set(fn(v));
  };
  return get;
};

export const computed = (fn) => {
  let es;
  let d = true;
  let v;
  const e = ce(fn, () => {
    if (!d) {
      d = true;
      es && trigger(es);
    }
  });
  return () => {
    track(es || (es = new Set()));
    if (!d) return v;
    d = false;
    return (v = e.run());
  };
};
