import { CombineLatest } from 'async-iterators-combine/combine-latest.js';
import { from } from './from.js';

export const combineIterable = (iterable, options) =>
  async function* (...x) {
    yield* new CombineLatest(
      iterable.map((value) => from(value)(...x)),
      options
    );
  };
