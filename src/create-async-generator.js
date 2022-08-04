export const createAsyncGenerator = (item) =>
  async function* (...x) {
    if (typeof item?.[Symbol.asyncIterator] === 'function') {
      for await (const value of item) {
        yield* createAsyncGenerator(value)(...x);
      }
    } else if (typeof item === 'function') {
      yield* createAsyncGenerator(item(...x))(...x);
    } else if (item?.then) {
      yield* createAsyncGenerator(await item)(...x);
    } else {
      yield item;
    }
  };
