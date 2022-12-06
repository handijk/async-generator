import { createAsyncGenerator } from './create-async-generator.js';
import { flattenIterator } from './flatten-iterator.js';
import { hasIterator } from './has-iterator.js';

export const flattenOrNot =
  (generatorFn) =>
  (iterable, { flatten, depth, ...options } = {}) =>
    async function* (...x) {
      const generator = generatorFn(
        Array.from(iterable, (item) => createAsyncGenerator(item)(...x)),
        options
      );
      for await (const value of generator) {
        if (flatten && depth && hasIterator(value)) {
          yield* flattenOrNot(generatorFn)(flattenIterator(value, depth), {
            ...options,
            flatten: flatten - 1,
            depth,
          })(...x);
        } else {
          yield value;
        }
      }
    };
