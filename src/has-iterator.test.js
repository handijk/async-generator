import { test, expect, describe } from 'vitest';
import { hasIterator } from './has-iterator.js';

describe('has-iterator', () => {
  test('has no iterator', () => {
    expect(hasIterator(['test1', 'test2', 'test3'])).toBe(false);
  });

  test('has an iterator', () => {
    expect(hasIterator(['test1', ['test2', 'test3']])).toBe(true);
  });
});
