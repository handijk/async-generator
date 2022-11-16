import { test, expect, describe } from 'vitest';
import { flattenIterator } from './flatten-iterator.js';

describe('flatten-iterator', () => {
  test('flattening not needed', () => {
    const result = flattenIterator(['test1', 'test2', 'test3']);
    expect(result.next()).toEqual({ value: 'test1', done: false });
    expect(result.next()).toEqual({ value: 'test2', done: false });
    expect(result.next()).toEqual({ value: 'test3', done: false });
    expect(result.next()).toEqual({ value: undefined, done: true });
  });

  test('flatten one level deep', () => {
    const result = flattenIterator([
      'test1',
      ['test2', ['test3', 'test4']],
      'test5',
    ]);
    expect(result.next()).toEqual({ value: 'test1', done: false });
    expect(result.next()).toEqual({ value: 'test2', done: false });
    expect(result.next()).toEqual({ value: ['test3', 'test4'], done: false });
    expect(result.next()).toEqual({ value: 'test5', done: false });
    expect(result.next()).toEqual({ value: undefined, done: true });
  });

  test('flatten infinitely deep', () => {
    const result = flattenIterator(
      ['test1', ['test2', ['test3', 'test4']], 'test5'],
      Infinity
    );
    expect(result.next()).toEqual({ value: 'test1', done: false });
    expect(result.next()).toEqual({ value: 'test2', done: false });
    expect(result.next()).toEqual({ value: 'test3', done: false });
    expect(result.next()).toEqual({ value: 'test4', done: false });
    expect(result.next()).toEqual({ value: 'test5', done: false });
    expect(result.next()).toEqual({ value: undefined, done: true });
  });
});
