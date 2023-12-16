import { describe, vi, test, expect } from 'vitest';
import { from } from './from.js';

describe('from', () => {
  async function* createAsyncIterable() {
    yield 1;
    yield 2;
    yield 3;
  }

  test('an async iterable as input', async () => {
    const input = createAsyncIterable();
    const generator = from(input);
    const iterable = generator();
    const output1 = await iterable.next();
    const output2 = await iterable.next();
    const output3 = await iterable.next();
    const output4 = await iterable.next();
    expect(output1.value).toEqual(1);
    expect(output2.value).toEqual(2);
    expect(output3.value).toEqual(3);
    expect(output4.done).toEqual(true);
  });

  test('a method as input', async () => {
    const input = vi.fn(() => 1);
    const x = {};
    const generator = from(input);
    const iterable = generator(x);
    const output1 = await iterable.next();
    const output2 = await iterable.next();
    expect(output1.value).toEqual(1);
    expect(output2.done).toEqual(true);
    expect(input).toHaveBeenCalledWith(x);
    expect(input).toBeCalledTimes(1);
  });

  test('a promise as input', async () => {
    const input = Promise.resolve(1);
    const generator = from(input);
    const iterable = generator();
    const output1 = await iterable.next();
    const output2 = await iterable.next();
    expect(output1.value).toEqual(1);
    expect(output2.done).toEqual(true);
  });
});
