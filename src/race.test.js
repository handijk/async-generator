import { describe, vi, test, expect } from 'vitest';
import { race as originalRace } from 'async-iterators-combine';
import { race } from './race.js';
import { flattenOrNot } from './flatten-or-not.js';

vi.mock('async-iterators-combine', () => ({
  race: Symbol('race mock'),
}));

vi.mock('./flatten-or-not.js', () => ({
  flattenOrNot: vi.fn(() => 'flatten or not mock'),
}));

describe('race', () => {
  test('will call flatten or not with race', () => {
    expect(race).toBe('flatten or not mock');
    expect(flattenOrNot).toHaveBeenCalledTimes(1);
    expect(flattenOrNot).toHaveBeenCalledWith(originalRace);
  });
});
