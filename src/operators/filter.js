export const filter = (fn) =>
  async function* (asyncIterable, ...args) {
    try {
      let i = 0;
      for await (const value of asyncIterable) {
        if (fn(value, i, ...args)) {
          yield value;
        }
        i++;
      }
    } finally {
      // TODO: check if we really need this return
      await asyncIterable.return();
    }
  };
