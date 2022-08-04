import { jest, test, expect, describe } from '@jest/globals';
import { pipe } from './pipe.js';

describe('pipe', () => {
  jest.mock('./create-async-generator.js', () => ({
    createAsyncGenerator: (input) => input,
  }));

  async function* createAsyncIterable() {
    yield 1;
    yield 2;
    yield 3;
  }

  test('an async iterable as input', async () => {
    const input = createAsyncIterable();
    const fn1 = jest.fn(async function* (asyncIterable) {
      for await (const value of asyncIterable) {
        yield value;
        yield value * 2;
      }
    });
    const iterable = pipe(input, fn1)();
    const output1 = await iterable.next();
    const output2 = await iterable.next();
    const output3 = await iterable.next();
    const output4 = await iterable.next();
    const output5 = await iterable.next();
    const output6 = await iterable.next();
    const output7 = await iterable.next();
    expect(output1.value).toEqual(1);
    expect(output2.value).toEqual(2);
    expect(output3.value).toEqual(2);
    expect(output4.value).toEqual(4);
    expect(output5.value).toEqual(3);
    expect(output6.value).toEqual(6);
    expect(output7.done).toEqual(true);
  });
});
