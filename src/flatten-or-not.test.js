import { describe, vi, test, expect, afterEach } from 'vitest';
import { createAsyncGenerator } from './create-async-generator.js';
import { flattenIterator } from './flatten-iterator.js';
import { hasIterator } from './has-iterator.js';
import { flattenOrNot } from './flatten-or-not.js';

vi.mock('./create-async-generator.js', () => ({
  createAsyncGenerator: vi.fn(),
}));

vi.mock('./flatten-iterator.js', () => ({
  flattenIterator: vi.fn(),
}));

vi.mock('./has-iterator.js', () => ({
  hasIterator: vi.fn(),
}));

describe('flattenOrNot', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  test('will combine all and create async generator and not flatten', async () => {
    const yield1 = Symbol('yield 1');
    const yield2 = Symbol('yield 2');
    const yield3 = Symbol('yield 3');
    const flatten = Infinity;
    const depth = Infinity;
    async function* createAsyncIterable() {
      yield yield1;
      yield yield2;
      yield yield3;
    }
    const originalGeneratorSpy = vi.fn();
    const generator = flattenOrNot(originalGeneratorSpy);
    const args = [Symbol('arg 1'), Symbol('arg 2')];
    const option = Symbol('option');
    const options = { option, flatten, depth };
    const input = [Symbol('input 1'), Symbol('input 2'), Symbol('input 3')];
    const flattened = [Symbol('flat 1'), Symbol('flat 2'), Symbol('flat 3')];
    const mockedGenerator = Symbol('mocked generator');

    const generatorSpy = vi.fn(() => mockedGenerator);

    hasIterator.mockReturnValueOnce(false);
    hasIterator.mockReturnValueOnce(false);
    hasIterator.mockReturnValueOnce(false);
    flattenIterator.mockReturnValueOnce(flattened);
    originalGeneratorSpy.mockReturnValueOnce(createAsyncIterable());
    createAsyncGenerator.mockReturnValue(generatorSpy);

    const asyncIterator = generator(input, options)(...args);

    expect(await asyncIterator.next()).toEqual({
      done: false,
      value: yield1,
    });
    expect(await asyncIterator.next()).toEqual({
      done: false,
      value: yield2,
    });
    expect(await asyncIterator.next()).toEqual({
      done: false,
      value: yield3,
    });
    expect(await asyncIterator.next()).toEqual({
      done: true,
      value: undefined,
    });

    expect(flattenIterator).not.toHaveBeenCalled();
    expect(hasIterator).toHaveBeenCalledTimes(3);
    expect(hasIterator).toHaveBeenNthCalledWith(1, yield1);
    expect(hasIterator).toHaveBeenNthCalledWith(2, yield2);
    expect(hasIterator).toHaveBeenNthCalledWith(3, yield3);
    expect(originalGeneratorSpy).toHaveBeenCalledTimes(1);
    expect(originalGeneratorSpy).toHaveBeenNthCalledWith(
      1,
      [mockedGenerator, mockedGenerator, mockedGenerator],
      { option }
    );
    expect(createAsyncGenerator).toHaveBeenCalledTimes(3);
    expect(createAsyncGenerator).toHaveBeenNthCalledWith(1, input[0]);
    expect(createAsyncGenerator).toHaveBeenNthCalledWith(2, input[1]);
    expect(createAsyncGenerator).toHaveBeenNthCalledWith(3, input[2]);
    expect(generatorSpy).toHaveBeenCalledTimes(3);
    expect(generatorSpy).toHaveBeenNthCalledWith(1, ...args);
    expect(generatorSpy).toHaveBeenNthCalledWith(2, ...args);
    expect(generatorSpy).toHaveBeenNthCalledWith(3, ...args);
  });

  test('will combine all and create async generator and flatten until the result is flat', async () => {
    const yield1 = Symbol('yield 1');
    const yield2 = Symbol('yield 2');
    const yield3 = Symbol('yield 3');
    const yieldFlat1 = Symbol('yield flat 1');
    const yieldFlat2 = Symbol('yield flat 2');
    const yieldFlat3 = Symbol('yield flat 3');
    const flatten = Infinity;
    const depth = Infinity;
    async function* createAsyncIterable() {
      yield yield1;
      yield yield2;
      yield yield3;
    }
    async function* createChildAsyncIterable() {
      yield yieldFlat1;
      yield yieldFlat2;
      yield yieldFlat3;
    }
    const originalGeneratorSpy = vi.fn();
    const all = flattenOrNot(originalGeneratorSpy);
    const args = [Symbol('arg 1'), Symbol('arg 2')];
    const option = Symbol('option');
    const options = { option, flatten, depth };
    const input = [Symbol('input 1'), Symbol('input 2'), Symbol('input 3')];
    const flattened = [Symbol('flat 1'), Symbol('flat 2'), Symbol('flat 3')];
    const mockedGenerator = Symbol('mocked generator');

    const generatorSpy = vi.fn(() => mockedGenerator);

    hasIterator.mockReturnValueOnce(true);
    hasIterator.mockReturnValueOnce(false);
    hasIterator.mockReturnValueOnce(false);
    hasIterator.mockReturnValueOnce(false);
    hasIterator.mockReturnValueOnce(false);
    hasIterator.mockReturnValueOnce(false);
    flattenIterator.mockReturnValueOnce(flattened);
    originalGeneratorSpy.mockReturnValueOnce(createAsyncIterable());
    originalGeneratorSpy.mockReturnValueOnce(createChildAsyncIterable());
    createAsyncGenerator.mockReturnValue(generatorSpy);

    const asyncIterator = all(input, options)(...args);

    expect(await asyncIterator.next()).toEqual({
      done: false,
      value: yieldFlat1,
    });
    expect(await asyncIterator.next()).toEqual({
      done: false,
      value: yieldFlat2,
    });
    expect(await asyncIterator.next()).toEqual({
      done: false,
      value: yieldFlat3,
    });
    expect(await asyncIterator.next()).toEqual({
      done: false,
      value: yield2,
    });
    expect(await asyncIterator.next()).toEqual({
      done: false,
      value: yield3,
    });
    expect(await asyncIterator.next()).toEqual({
      done: true,
      value: undefined,
    });

    expect(flattenIterator).toHaveBeenCalledTimes(1);
    expect(flattenIterator).toHaveBeenCalledWith(yield1, depth);
    expect(hasIterator).toHaveBeenCalledTimes(6);
    expect(hasIterator).toHaveBeenNthCalledWith(1, yield1);
    expect(hasIterator).toHaveBeenNthCalledWith(2, yieldFlat1);
    expect(hasIterator).toHaveBeenNthCalledWith(3, yieldFlat2);
    expect(hasIterator).toHaveBeenNthCalledWith(4, yieldFlat3);
    expect(hasIterator).toHaveBeenNthCalledWith(5, yield2);
    expect(hasIterator).toHaveBeenNthCalledWith(6, yield3);
    expect(originalGeneratorSpy).toHaveBeenCalledTimes(2);
    expect(originalGeneratorSpy).toHaveBeenNthCalledWith(
      1,
      [mockedGenerator, mockedGenerator, mockedGenerator],
      { option }
    );
    expect(originalGeneratorSpy).toHaveBeenNthCalledWith(
      2,
      [mockedGenerator, mockedGenerator, mockedGenerator],
      { option }
    );
    expect(createAsyncGenerator).toHaveBeenCalledTimes(6);
    expect(createAsyncGenerator).toHaveBeenNthCalledWith(1, input[0]);
    expect(createAsyncGenerator).toHaveBeenNthCalledWith(2, input[1]);
    expect(createAsyncGenerator).toHaveBeenNthCalledWith(3, input[2]);
    expect(createAsyncGenerator).toHaveBeenNthCalledWith(4, flattened[0]);
    expect(createAsyncGenerator).toHaveBeenNthCalledWith(5, flattened[1]);
    expect(createAsyncGenerator).toHaveBeenNthCalledWith(6, flattened[2]);
    expect(generatorSpy).toHaveBeenCalledTimes(6);
    expect(generatorSpy).toHaveBeenNthCalledWith(1, ...args);
    expect(generatorSpy).toHaveBeenNthCalledWith(2, ...args);
    expect(generatorSpy).toHaveBeenNthCalledWith(3, ...args);
    expect(generatorSpy).toHaveBeenNthCalledWith(4, ...args);
    expect(generatorSpy).toHaveBeenNthCalledWith(5, ...args);
    expect(generatorSpy).toHaveBeenNthCalledWith(6, ...args);
  });

  test('will combine all and create async generator and flatten for a fixed number of times', async () => {
    const yield1 = Symbol('yield 1');
    const yield2 = Symbol('yield 2');
    const yield3 = Symbol('yield 3');
    const yieldFlat1 = Symbol('yield flat 1');
    const yieldFlat2 = Symbol('yield flat 2');
    const yieldFlat3 = Symbol('yield flat 3');
    const flatten = 1;
    const depth = Infinity;
    async function* createAsyncIterable() {
      yield yield1;
      yield yield2;
      yield yield3;
    }
    async function* createChildAsyncIterable() {
      yield yieldFlat1;
      yield yieldFlat2;
      yield yieldFlat3;
    }
    const originalGeneratorSpy = vi.fn();
    const generator = flattenOrNot(originalGeneratorSpy);
    const args = [Symbol('arg 1'), Symbol('arg 2')];
    const option = Symbol('option');
    const options = { option, flatten, depth };
    const input = [Symbol('input 1'), Symbol('input 2'), Symbol('input 3')];
    const flattened = [Symbol('flat 1'), Symbol('flat 2'), Symbol('flat 3')];
    const mockedGenerator = Symbol('mocked generator');

    const generatorSpy = vi.fn(() => mockedGenerator);

    hasIterator.mockReturnValueOnce(true);
    hasIterator.mockReturnValueOnce(false);
    hasIterator.mockReturnValueOnce(false);
    flattenIterator.mockReturnValueOnce(flattened);
    originalGeneratorSpy.mockReturnValueOnce(createAsyncIterable());
    originalGeneratorSpy.mockReturnValueOnce(createChildAsyncIterable());
    createAsyncGenerator.mockReturnValue(generatorSpy);

    const asyncIterator = generator(input, options)(...args);

    expect(await asyncIterator.next()).toEqual({
      done: false,
      value: yieldFlat1,
    });
    expect(await asyncIterator.next()).toEqual({
      done: false,
      value: yieldFlat2,
    });
    expect(await asyncIterator.next()).toEqual({
      done: false,
      value: yieldFlat3,
    });
    expect(await asyncIterator.next()).toEqual({
      done: false,
      value: yield2,
    });
    expect(await asyncIterator.next()).toEqual({
      done: false,
      value: yield3,
    });
    expect(await asyncIterator.next()).toEqual({
      done: true,
      value: undefined,
    });

    expect(flattenIterator).toHaveBeenCalledTimes(1);
    expect(flattenIterator).toHaveBeenCalledWith(yield1, depth);
    expect(hasIterator).toHaveBeenCalledTimes(3);
    expect(hasIterator).toHaveBeenNthCalledWith(1, yield1);
    expect(hasIterator).toHaveBeenNthCalledWith(2, yield2);
    expect(hasIterator).toHaveBeenNthCalledWith(3, yield3);
    expect(originalGeneratorSpy).toHaveBeenCalledTimes(2);
    expect(originalGeneratorSpy).toHaveBeenNthCalledWith(
      1,
      [mockedGenerator, mockedGenerator, mockedGenerator],
      { option }
    );
    expect(originalGeneratorSpy).toHaveBeenNthCalledWith(
      2,
      [mockedGenerator, mockedGenerator, mockedGenerator],
      { option }
    );
    expect(createAsyncGenerator).toHaveBeenCalledTimes(6);
    expect(createAsyncGenerator).toHaveBeenNthCalledWith(1, input[0]);
    expect(createAsyncGenerator).toHaveBeenNthCalledWith(2, input[1]);
    expect(createAsyncGenerator).toHaveBeenNthCalledWith(3, input[2]);
    expect(createAsyncGenerator).toHaveBeenNthCalledWith(4, flattened[0]);
    expect(createAsyncGenerator).toHaveBeenNthCalledWith(5, flattened[1]);
    expect(createAsyncGenerator).toHaveBeenNthCalledWith(6, flattened[2]);
    expect(generatorSpy).toHaveBeenCalledTimes(6);
    expect(generatorSpy).toHaveBeenNthCalledWith(1, ...args);
    expect(generatorSpy).toHaveBeenNthCalledWith(2, ...args);
    expect(generatorSpy).toHaveBeenNthCalledWith(3, ...args);
    expect(generatorSpy).toHaveBeenNthCalledWith(4, ...args);
    expect(generatorSpy).toHaveBeenNthCalledWith(5, ...args);
    expect(generatorSpy).toHaveBeenNthCalledWith(6, ...args);
  });
});
