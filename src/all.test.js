import { describe, vi, test, expect } from 'vitest';
import { all as originalAll } from 'async-iterators-combine';
import { all } from './all.js';
import { flattenOrNot } from './flatten-or-not.js';

vi.mock('async-iterators-combine', () => ({
  all: Symbol('all mock'),
}));

vi.mock('./flatten-or-not.js', () => ({
  flattenOrNot: vi.fn(() => 'flatten or not mock'),
}));

describe('all', () => {
  test('will call flatten or not with all', () => {
    expect(all).toBe('flatten or not mock');
    expect(flattenOrNot).toHaveBeenCalledTimes(1);
    expect(flattenOrNot).toHaveBeenCalledWith(originalAll);
  });
});
