interface ViewAttr {
  style?: string | Record<string, string>;
  [key: string]: unknown;
}

type ViewChildren = string | number | (() => void);

type ViewEvents<T = keyof HTMLElementEventMap> = {
  [on in `on${T}`]: (
    func: (event: HTMLElementEventMap[T]) => void
  ) => ViewElement;
};

type ViewStyles<T = keyof CSSStyleDeclaration> = {
  [set in T]: (value: () => CSSStyleDeclaration[T]) => ViewElement;
};

type ViewElement = {
  style: (style: Partial<CSSStyleDeclaration>) => ViewElement;
  // [style: StyleName]: (
  //   value: string | number | (() => string | number)
  // ) => ViewElement;
} & ViewEvents &
  ViewStyles;

export const view: (name: string, children?: ViewChildren) => ViewElement;

export const text: (value: ViewChildren) => void;

export const render: (Component: () => void, target: Element) => void;
