import { combineLatest as originalCombineLatest } from 'async-iterators-combine';
import { createAsyncGenerator } from './create-async-generator.js';

const defaultModule = {
  originalCombineLatest,
  createAsyncGenerator,
};

export const combineLatest = (iterable, options) =>
  async function* (x) {
    yield* defaultModule.originalCombineLatest(
      Array.from(iterable, (item) =>
        defaultModule.createAsyncGenerator(item)(x)
      ),
      options
    );
  };

export default defaultModule;
