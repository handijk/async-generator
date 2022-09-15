import { all as originalAll } from 'async-iterators-combine';
import { createAsyncGenerator } from './create-async-generator.js';

const defaultModule = {
  originalAll,
  createAsyncGenerator,
};

export const all = (iterable, options) =>
  async function* (x) {
    yield* defaultModule.originalAll(
      Array.from(iterable, (item) =>
        defaultModule.createAsyncGenerator(item)(x)
      ),
      options
    );
  };

export default defaultModule;
