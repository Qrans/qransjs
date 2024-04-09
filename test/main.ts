import { computed, signal } from "../src/core";
import { render, text, view } from "../src/render";
import "./style.css";

const store = (() => {
  const count = signal(0);
  return () => ({
    count: computed(() => count()),
    add() {
      count.update((p) => p + 1);
    },
  });
})();

const AView = () => {
  const { count, add } = store();
  view("div", () => {
    view("button", "click me").onclick(() => add());
  })
    .style({ padding: "15px" })
    .marginBottom(() => `${count()}px`);
};

const BView = () => {
  const { count } = store();

  view("div", () => {
    text("count is:");
    text(count);
  });
};

const HomeView = () => {
  AView();
  BView();
};

render(HomeView, document.body.querySelector("#app")!);
