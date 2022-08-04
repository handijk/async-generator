import { jest, test, expect, describe } from '@jest/globals';
import { map } from './map.js';

describe('map operator', () => {
  async function* createAsyncIterable() {
    yield 1;
    yield 2;
    yield 3;
  }

  test('the async iterable is mapped to a new value by the predicate method', async () => {
    const spy = jest.fn((input) => input % 2 === 0);
    const generator = map(spy);
    const input = createAsyncIterable();
    const iterable = generator(input);
    const output1 = await iterable.next();
    expect(spy).toBeCalledWith(1, 0);
    const output2 = await iterable.next();
    expect(spy).toBeCalledWith(2, 1);
    const output3 = await iterable.next();
    expect(spy).toBeCalledWith(3, 2);
    const output4 = await iterable.next();
    expect(output1.value).toEqual(false);
    expect(output2.value).toEqual(true);
    expect(output3.value).toEqual(false);
    expect(output4.done).toEqual(true);
    expect(spy).toBeCalledTimes(3);
  });
});
