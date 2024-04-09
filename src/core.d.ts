/** 副作用函数 */
type Effect = () => void;

/** 信号 */
interface Signal<T> {
  (): T;
  set(value: T): void;
  update(fn: (value: T) => T): void;
}

/** 创建一个信号 */
export const signal: <T>(value: T) => Signal<T>;

/** 创建一个副作用函数 */
export const effect: (fn: Effect) => () => void;

/** 创建一个计算 */
export const computed: <T>(fn: () => T) => () => T;
