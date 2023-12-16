import { vi, test, expect, describe } from 'vitest';
import { map } from './map.js';

describe('map operator', () => {
  async function* createAsyncIterable() {
    yield 1;
    yield 2;
    yield 3;
  }

  test('the async iterable is mapped to a new value by the predicate method', async () => {
    const spy = vi.fn((input) => input % 2 === 0);
    const arg1 = Symbol('arg1');
    const arg2 = Symbol('arg2');
    const generator = map(spy);
    const input = createAsyncIterable();
    const iterable = generator(input, arg1, arg2);
    const output1 = await iterable.next();
    expect(spy).toHaveBeenNthCalledWith(1, 1, 0, arg1, arg2);
    expect(output1.value).toEqual(false);
    const output2 = await iterable.next();
    expect(output2.value).toEqual(true);
    expect(spy).toHaveBeenNthCalledWith(2, 2, 1, arg1, arg2);
    const output3 = await iterable.next();
    expect(spy).toHaveBeenNthCalledWith(3, 3, 2, arg1, arg2);
    expect(output3.value).toEqual(false);
    const output4 = await iterable.next();
    expect(output4.done).toEqual(true);
    expect(spy).toBeCalledTimes(3);
  });
});
