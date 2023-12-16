import { combineIterable } from './combine-iterable.js';

export const combineObject = (object, options) =>
  async function* (...x) {
    const keys = Object.keys(object);
    for await (const values of combineIterable(
      Object.values(object),
      options
    )(...x)) {
      yield values.reduce(
        (acc, value, i) => ({ ...acc, [keys[i]]: value }),
        {}
      );
    }
  };
