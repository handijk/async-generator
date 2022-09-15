import { race as originalRace } from 'async-iterators-combine';
import { createAsyncGenerator } from './create-async-generator.js';

const defaultModule = {
  originalRace,
  createAsyncGenerator,
};

export const race = (iterable, options) =>
  async function* (x) {
    yield* defaultModule.originalRace(
      Array.from(iterable, (item) =>
        defaultModule.createAsyncGenerator(item)(x)
      ),
      options
    );
  };

export default defaultModule;
