export const filter = (fn) =>
  async function* (asyncIterable) {
    let i = 0;
    for await (const value of asyncIterable) {
      if (fn(value, i)) {
        yield value;
      }
      i++;
    }
  };
