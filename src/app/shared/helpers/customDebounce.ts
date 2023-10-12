export function debounce(
  { fn, ms, context }:
    // eslint-disable-next-line @typescript-eslint/ban-types
    { fn: Function, ms: number, context: unknown }
  // eslint-disable-next-line @typescript-eslint/ban-types
): Function {

  let timerId: number;

  return function (...restParams: []) {
    if (timerId) {
      window.clearTimeout(timerId);
    }

    timerId = window.setTimeout(() => {
      window.clearTimeout(timerId);
      fn.apply(context, restParams);
    }, ms);
  };
}
