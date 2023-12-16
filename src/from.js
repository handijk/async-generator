export const from = (value) =>
  async function* (...args) {
    if (value?.[Symbol.asyncIterator]) {
      yield* value;
    } else if (value?.then) {
      yield* from(await value)(...args);
    } else if (typeof value === 'function') {
      yield* from(value(...args))(...args);
    } else {
      yield value;
    }
  };
