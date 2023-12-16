import { vi, test, expect, describe } from 'vitest';
import { delegateMap } from './delegate-map.js';

describe('delegateMap operator', () => {
  async function* createAsyncIterable() {
    yield 1;
    yield 3;
    yield 9;
  }

  async function* createSecondAsyncGenerator(value) {
    yield value * 2;
    yield value * 4;
    yield value * 16;
  }

  test('the async iterable is mapped to a new value by the predicate method', async () => {
    const spies = [];
    const spy = vi.fn((input) => {
      const innerSpy = vi.fn((...args) =>
        createSecondAsyncGenerator(input, ...args)
      );
      spies.push(innerSpy);
      return innerSpy;
    });
    const arg1 = Symbol('arg1');
    const arg2 = Symbol('arg2');
    const generator = delegateMap(spy);
    const input = createAsyncIterable();
    const iterable = generator(input, arg1, arg2);
    const output1 = await iterable.next();
    expect(spy).toHaveBeenNthCalledWith(1, 1, 0, arg1, arg2);
    expect(spies[0]).toHaveBeenNthCalledWith(1, arg1, arg2);
    expect(output1.value).toEqual(2);
    const output2 = await iterable.next();
    expect(output2.value).toEqual(4);
    const output3 = await iterable.next();
    expect(output3.value).toEqual(16);
    const output4 = await iterable.next();
    expect(spy).toHaveBeenNthCalledWith(2, 3, 1, arg1, arg2);
    expect(spies[1]).toHaveBeenNthCalledWith(1, arg1, arg2);
    expect(output4.value).toEqual(6);
    const output5 = await iterable.next();
    expect(output5.value).toEqual(12);
    const output6 = await iterable.next();
    expect(output6.value).toEqual(48);
    const output7 = await iterable.next();
    expect(output7.value).toEqual(18);
    expect(spy).toHaveBeenNthCalledWith(3, 9, 2, arg1, arg2);
    expect(spies[2]).toHaveBeenNthCalledWith(1, arg1, arg2);
    const output8 = await iterable.next();
    expect(output8.value).toEqual(36);
    const output9 = await iterable.next();
    expect(output9.value).toEqual(144);
    const output10 = await iterable.next();
    expect(output10.value).toEqual(undefined);
    expect(output10.done).toEqual(true);
    expect(spy).toBeCalledTimes(3);
    expect(spies[0]).toBeCalledTimes(1);
    expect(spies[1]).toBeCalledTimes(1);
    expect(spies[2]).toBeCalledTimes(1);
  });
});
