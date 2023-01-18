import { createAsyncGenerator } from './create-async-generator.js';

export const pipe = (asyncIterable, ...fns) =>
  async function* (...x) {
    yield* fns.reduce(async function* (acc, curr) {
      yield* createAsyncGenerator(curr(acc))(...x);
    }, createAsyncGenerator(asyncIterable)(...x));
  };
