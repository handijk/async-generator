export const hasIterator = (iterator) =>
  !!Array.from(iterator).find(
    (item) => typeof item !== 'string' && item?.[Symbol.iterator]
  );
