export const flattenIterator = function* (iterator, depth = 1) {
  if (!depth) {
    yield* iterator;
  } else {
    for (let item of iterator) {
      if (typeof item !== 'string' && item?.[Symbol.iterator]) {
        yield* flattenIterator(item, depth - 1);
      } else {
        yield item;
      }
    }
  }
};
