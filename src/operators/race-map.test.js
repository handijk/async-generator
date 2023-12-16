import { vi, test, expect, describe } from 'vitest';
import { raceMap } from './race-map.js';

describe('raceMap operator', () => {
  test('the generator returns immediately', async () => {
    const returnValue = Symbol('returnValue');
    // eslint-disable-next-line require-yield
    async function* createAsyncIterable() {
      return returnValue;
    }

    const spy = vi.fn((input) => input % 2 === 0);
    const arg1 = Symbol('arg1');
    const arg2 = Symbol('arg2');
    const generator = raceMap(spy);
    const input = createAsyncIterable();
    const iterable = generator(input, arg1, arg2);
    const output4 = await iterable.next();
    expect(output4).toStrictEqual({ done: true, value: returnValue });
    expect(spy).toBeCalledTimes(0);
  });

  test('the generator values are mapped to a new value by the predicate method synchronously', async () => {
    const returnValue = Symbol('returnValue');
    async function* createAsyncIterable() {
      yield 1;
      yield 2;
      yield 3;
      return returnValue;
    }

    const spy = vi.fn((input) => input % 2 === 0);
    const arg1 = Symbol('arg1');
    const arg2 = Symbol('arg2');
    const generator = raceMap(spy);
    const input = createAsyncIterable();
    const iterable = generator(input, arg1, arg2);
    const output1 = await iterable.next();
    expect(output1).toStrictEqual({ value: false, done: false });
    expect(spy.mock.calls[0][0]).toBe(1);
    expect(spy.mock.calls[0][1]).toBe(0);
    expect(spy.mock.calls[0][2].aborted).toBe(false);
    expect(spy.mock.calls[0][3]).toBe(arg1);
    expect(spy.mock.calls[0][4]).toBe(arg2);
    const output2 = await iterable.next();
    expect(spy.mock.calls[0][2].aborted).toBe(true);
    expect(output2).toStrictEqual({ value: true, done: false });
    expect(spy.mock.calls[1][0]).toBe(2);
    expect(spy.mock.calls[1][1]).toBe(1);
    expect(spy.mock.calls[1][2].aborted).toBe(false);
    expect(spy.mock.calls[1][3]).toBe(arg1);
    expect(spy.mock.calls[1][4]).toBe(arg2);
    const output3 = await iterable.next();
    expect(spy.mock.calls[1][2].aborted).toBe(true);
    expect(output3).toStrictEqual({ value: false, done: false });
    expect(spy.mock.calls[2][0]).toBe(3);
    expect(spy.mock.calls[2][1]).toBe(2);
    expect(spy.mock.calls[2][2].aborted).toBe(false);
    expect(spy.mock.calls[2][3]).toBe(arg1);
    expect(spy.mock.calls[2][4]).toBe(arg2);
    const output4 = await iterable.next();
    expect(spy.mock.calls[2][2].aborted).toBe(true);
    expect(output4).toStrictEqual({ value: returnValue, done: true });
    expect(spy).toBeCalledTimes(3);
  });

  test('the generator values are mapped to a new value by the predicate method asynchronously', async () => {
    const returnValue = Symbol('returnValue');
    async function* createAsyncIterable() {
      yield 1;
      await new Promise((resolve) => {
        setTimeout(resolve, 10);
      });
      yield 2;
      await new Promise((resolve) => {
        setTimeout(resolve, 10);
      });
      yield 3;
      await new Promise((resolve) => {
        setTimeout(resolve, 10);
      });
      return returnValue;
    }

    const spy = vi.fn((input) => input % 2 === 0);
    const arg1 = Symbol('arg1');
    const arg2 = Symbol('arg2');
    const generator = raceMap(spy);
    const input = createAsyncIterable();
    const iterable = generator(input, arg1, arg2);
    const output1 = await iterable.next();
    expect(output1).toStrictEqual({ value: false, done: false });
    expect(spy.mock.calls[0][0]).toBe(1);
    expect(spy.mock.calls[0][1]).toBe(0);
    expect(spy.mock.calls[0][2].aborted).toBe(false);
    expect(spy.mock.calls[0][3]).toBe(arg1);
    expect(spy.mock.calls[0][4]).toBe(arg2);
    const output2 = await iterable.next();
    expect(spy.mock.calls[0][2].aborted).toBe(true);
    expect(output2).toStrictEqual({ value: true, done: false });
    expect(spy.mock.calls[1][0]).toBe(2);
    expect(spy.mock.calls[1][1]).toBe(1);
    expect(spy.mock.calls[1][2].aborted).toBe(false);
    expect(spy.mock.calls[1][3]).toBe(arg1);
    expect(spy.mock.calls[1][4]).toBe(arg2);
    const output3 = await iterable.next();
    expect(spy.mock.calls[1][2].aborted).toBe(true);
    expect(output3).toStrictEqual({ value: false, done: false });
    expect(spy.mock.calls[2][0]).toBe(3);
    expect(spy.mock.calls[2][1]).toBe(2);
    expect(spy.mock.calls[2][2].aborted).toBe(false);
    expect(spy.mock.calls[2][3]).toBe(arg1);
    expect(spy.mock.calls[2][4]).toBe(arg2);
    const output4 = await iterable.next();
    expect(spy.mock.calls[2][2].aborted).toBe(true);
    expect(output4).toStrictEqual({ value: returnValue, done: true });
    expect(spy).toBeCalledTimes(3);
  });

  test('the generator values are mapped to a new value by the asynchronous predicate method', async () => {
    const returnValue = Symbol('returnValue');
    async function* createAsyncIterable() {
      yield 1;
      yield 2;
      yield 3;
      return returnValue;
    }

    const spy = vi.fn(async (input) => {
      await new Promise((resolve) => {
        setTimeout(resolve, 10);
      });
      return input % 2 === 0;
    });
    const arg1 = Symbol('arg1');
    const arg2 = Symbol('arg2');
    const generator = raceMap(spy);
    const input = createAsyncIterable();
    const iterable = generator(input, arg1, arg2);
    const output1 = await iterable.next();
    expect(output1).toStrictEqual({ done: false, value: false });
    expect(spy.mock.calls[0][0]).toBe(1);
    expect(spy.mock.calls[0][1]).toBe(0);
    expect(spy.mock.calls[0][2].aborted).toBe(true);
    expect(spy.mock.calls[0][3]).toBe(arg1);
    expect(spy.mock.calls[0][4]).toBe(arg2);
    expect(spy.mock.calls[1][0]).toBe(2);
    expect(spy.mock.calls[1][1]).toBe(1);
    expect(spy.mock.calls[1][2].aborted).toBe(true);
    expect(spy.mock.calls[1][3]).toBe(arg1);
    expect(spy.mock.calls[1][4]).toBe(arg2);
    expect(spy.mock.calls[2][0]).toBe(3);
    expect(spy.mock.calls[2][1]).toBe(2);
    expect(spy.mock.calls[2][2].aborted).toBe(false);
    expect(spy.mock.calls[2][3]).toBe(arg1);
    expect(spy.mock.calls[2][4]).toBe(arg2);
    expect(spy).toBeCalledTimes(3);
    const output2 = await iterable.next();
    expect(spy.mock.calls[2][2].aborted).toBe(true);
    expect(output2).toStrictEqual({ done: true, value: returnValue });
    expect(spy).toBeCalledTimes(3);
  });

  test('the generator values are mapped to a new value by the asynchronous predicate method asynchronously', async () => {
    const returnValue = Symbol('returnValue');
    async function* createAsyncIterable() {
      yield 1;
      await new Promise((resolve) => {
        setTimeout(resolve, 5);
      });
      yield 2;
      await new Promise((resolve) => {
        setTimeout(resolve, 20);
      });
      yield 3;
      await new Promise((resolve) => {
        setTimeout(resolve, 10);
      });
      return returnValue;
    }

    const spy = vi.fn(async (input) => {
      await new Promise((resolve) => {
        setTimeout(resolve, 10);
      });
      return input * 16;
    });
    const arg1 = Symbol('arg1');
    const arg2 = Symbol('arg2');
    const generator = raceMap(spy);
    const input = createAsyncIterable();
    const iterable = generator(input, arg1, arg2);
    const output1 = await iterable.next();
    expect(output1).toStrictEqual({ value: 32, done: false });
    expect(spy.mock.calls[0][0]).toBe(1);
    expect(spy.mock.calls[0][1]).toBe(0);
    expect(spy.mock.calls[0][2].aborted).toBe(true);
    expect(spy.mock.calls[0][3]).toBe(arg1);
    expect(spy.mock.calls[0][4]).toBe(arg2);
    expect(spy.mock.calls[1][0]).toBe(2);
    expect(spy.mock.calls[1][1]).toBe(1);
    expect(spy.mock.calls[1][2].aborted).toBe(false);
    expect(spy.mock.calls[1][3]).toBe(arg1);
    expect(spy.mock.calls[1][4]).toBe(arg2);
    const output2 = await iterable.next();
    expect(spy.mock.calls[1][2].aborted).toBe(true);
    expect(output2).toStrictEqual({ value: 48, done: false });
    expect(spy.mock.calls[2][0]).toBe(3);
    expect(spy.mock.calls[2][1]).toBe(2);
    expect(spy.mock.calls[2][2].aborted).toBe(false);
    expect(spy.mock.calls[2][3]).toBe(arg1);
    expect(spy.mock.calls[2][4]).toBe(arg2);
    const output4 = await iterable.next();
    expect(spy.mock.calls[2][2].aborted).toBe(true);
    expect(output4).toStrictEqual({ value: returnValue, done: true });
    expect(spy).toBeCalledTimes(3);
  });
});
