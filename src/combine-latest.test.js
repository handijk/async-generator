import { describe, jest, test, expect } from '@jest/globals';
import combineLatestModule from './combine-latest.js';
import { combineLatest } from './combine-latest.js';

describe('combine latest', () => {
  async function* createAsyncIterable() {
    yield 1;
    yield 2;
    yield 3;
  }

  test('will combine combine latest and create async generator', async () => {
    const x = Symbol();
    const options = Symbol();
    const input = [Symbol(), Symbol(), Symbol()];
    const mockedGenerator = Symbol();

    const originalCombineLatestSpy = jest.spyOn(
      combineLatestModule,
      'originalCombineLatest'
    );
    const createAsyncGeneratorSpy = jest.spyOn(
      combineLatestModule,
      'createAsyncGenerator'
    );
    const generatorSpy = jest.fn(() => mockedGenerator);

    originalCombineLatestSpy.mockReturnValueOnce(createAsyncIterable());
    createAsyncGeneratorSpy.mockReturnValue(generatorSpy);

    const asyncIterator = combineLatest(input, options)(x);

    expect(await asyncIterator.next()).toEqual({ done: false, value: 1 });
    expect(await asyncIterator.next()).toEqual({ done: false, value: 2 });
    expect(await asyncIterator.next()).toEqual({ done: false, value: 3 });
    expect(await asyncIterator.next()).toEqual({
      done: true,
      value: undefined,
    });

    expect(originalCombineLatestSpy).toHaveBeenCalledTimes(1);
    expect(originalCombineLatestSpy.mock.calls[0][0][0]).toBe(mockedGenerator);
    expect(originalCombineLatestSpy.mock.calls[0][0][1]).toBe(mockedGenerator);
    expect(originalCombineLatestSpy.mock.calls[0][0][2]).toBe(mockedGenerator);
    expect(originalCombineLatestSpy.mock.calls[0][1]).toBe(options);
    expect(createAsyncGeneratorSpy).toHaveBeenCalledTimes(3);
    expect(createAsyncGeneratorSpy.mock.calls[0][0]).toBe(input[0]);
    expect(createAsyncGeneratorSpy.mock.calls[1][0]).toBe(input[1]);
    expect(createAsyncGeneratorSpy.mock.calls[2][0]).toBe(input[2]);
    expect(generatorSpy).toHaveBeenCalledTimes(3);
    expect(generatorSpy.mock.calls[0][0]).toBe(x);
    expect(generatorSpy.mock.calls[1][0]).toBe(x);
    expect(generatorSpy.mock.calls[2][0]).toBe(x);
  });
});
