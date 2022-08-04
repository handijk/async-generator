import { jest, test, expect, describe } from '@jest/globals';
import { filter } from './filter.js';

describe('filter operator', () => {
  async function* createAsyncIterable() {
    yield 1;
    yield 2;
    yield 3;
  }

  test('the async iterable is filtered by the predicate method', async () => {
    const spy = jest.fn((input) => input % 2 === 0);
    const generator = filter(spy);
    const input = createAsyncIterable();
    const iterable = generator(input);
    const output1 = await iterable.next();
    expect(spy).toBeCalledWith(1, 0);
    const output2 = await iterable.next();
    expect(spy).toBeCalledWith(2, 1);
    expect(spy).toBeCalledWith(3, 2);
    expect(output1.value).toEqual(2);
    expect(output2.done).toEqual(true);
    expect(spy).toBeCalledTimes(3);
  });
});
