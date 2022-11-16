import { vi, test, expect, describe } from 'vitest';
import { createAsyncGenerator } from './create-async-generator.js';
import { pipe } from './pipe.js';

vi.mock('./create-async-generator.js', () => ({
  createAsyncGenerator: vi.fn(),
}));

describe('pipe', () => {
  test('an async iterable as input', async () => {
    const input = (async function* () {
      yield 1;
      yield 2;
      yield 3;
    })();
    const fn1 = vi.fn();
    const fn2 = vi.fn();
    const fn1Result = Symbol('fn1 result');
    const fn2Result = Symbol('fn2 result');
    const mockGenerator1 = (async function* () {
      yield 'kippekop';
      yield 'varkensnek';
    })();
    const mockGenerator2 = (async function* () {
      yield 'kippekop2';
      yield 'varkensnek2';
    })();
    const args = [Symbol('arg1', Symbol('arg2'))];
    const mockGeneratorFn1 = vi.fn(() => mockGenerator1);
    const mockGeneratorFn2 = vi.fn(() => mockGenerator2);
    createAsyncGenerator.mockReturnValueOnce(mockGeneratorFn1);
    createAsyncGenerator.mockReturnValueOnce(mockGeneratorFn2);
    fn1.mockReturnValueOnce(fn1Result);
    fn2.mockReturnValueOnce(fn2Result);
    const iterable = pipe(input, fn1, fn2)(...args);
    expect(await iterable.next()).toEqual({ value: 'kippekop2', done: false });
    expect(await iterable.next()).toEqual({
      value: 'varkensnek2',
      done: false,
    });
    expect(await iterable.next()).toEqual({ value: undefined, done: true });
    expect(fn1).not.toHaveBeenCalled();
    expect(fn2).toHaveBeenCalledTimes(1);
    expect(fn2).toHaveBeenCalledWith(mockGenerator1);
    expect(createAsyncGenerator).toHaveBeenCalledTimes(2);
    expect(createAsyncGenerator).toHaveBeenNthCalledWith(1, input);
    expect(createAsyncGenerator).toHaveBeenNthCalledWith(2, fn2Result);
    expect(mockGeneratorFn1).toHaveBeenCalledTimes(1);
    expect(mockGeneratorFn1).toHaveBeenCalledWith(...args);
    expect(mockGeneratorFn2).toHaveBeenCalledTimes(1);
    expect(mockGeneratorFn2).toHaveBeenCalledWith(...args);
  });
});
