export function debounce(
  { fn, ms, context }:
    { fn: any, ms: number, context: any }
) {
  let timerId: any = null;

  return function (...restParams: any) {
    if (timerId) {
      clearTimeout(timerId);
    }

    timerId = setTimeout(() => {
      clearTimeout(timerId);
      fn.apply(context, restParams);
    }, ms);
  };
}
