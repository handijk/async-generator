import { describe, vi, test, expect } from 'vitest';
import { combineLatest as originalCombineLatest } from 'async-iterators-combine';
import { combineLatest } from './combine-latest.js';
import { flattenOrNot } from './flatten-or-not.js';

vi.mock('async-iterators-combine', () => ({
  combineLatest: Symbol('combineLatest mock'),
}));

vi.mock('./flatten-or-not.js', () => ({
  flattenOrNot: vi.fn(() => 'flatten or not mock'),
}));

describe('combineLatest', () => {
  test('will call flatten or not with race', () => {
    expect(combineLatest).toBe('flatten or not mock');
    expect(flattenOrNot).toHaveBeenCalledTimes(1);
    expect(flattenOrNot).toHaveBeenCalledWith(originalCombineLatest);
  });
});
