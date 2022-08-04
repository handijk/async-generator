export const map = (fn) =>
  async function* (asyncIterable) {
    let i = 0;
    for await (const value of asyncIterable) {
      yield fn(value, i);
      i++;
    }
  };
