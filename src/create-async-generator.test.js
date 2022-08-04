import { describe, jest, test, expect } from '@jest/globals';
import { createAsyncGenerator } from './create-async-generator';

describe('createAsyncGenerator', () => {
  async function* createAsyncIterable() {
    yield 1;
    yield 2;
    yield 3;
  }

  async function* createNestedAsyncIterable() {
    yield createAsyncIterable();
    yield createAsyncIterable;
    yield Promise.resolve(1);
  }

  test('an async iterable as input', async () => {
    const input = createAsyncIterable();
    const generator = createAsyncGenerator(input);
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
    const input = jest.fn(() => 1);
    const x = {};
    const generator = createAsyncGenerator(input);
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
    const generator = createAsyncGenerator(input);
    const iterable = generator();
    const output1 = await iterable.next();
    const output2 = await iterable.next();
    expect(output1.value).toEqual(1);
    expect(output2.done).toEqual(true);
  });

  test('a nested async iterable as input', async () => {
    const input = createNestedAsyncIterable();
    const generator = createAsyncGenerator(input);
    const iterable = generator();
    const output1 = await iterable.next();
    const output2 = await iterable.next();
    const output3 = await iterable.next();
    const output4 = await iterable.next();
    const output5 = await iterable.next();
    const output6 = await iterable.next();
    const output7 = await iterable.next();
    const output8 = await iterable.next();
    expect(output1.value).toEqual(1);
    expect(output2.value).toEqual(2);
    expect(output3.value).toEqual(3);
    expect(output4.value).toEqual(1);
    expect(output5.value).toEqual(2);
    expect(output6.value).toEqual(3);
    expect(output7.value).toEqual(1);
    expect(output8.done).toEqual(true);
  });
});
