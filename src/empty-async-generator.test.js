import { vi, test, expect, describe } from 'vitest';
import { EmptyAsyncGenerator } from './empty-async-generator.js';

describe('empty-async-generator', () => {
  test('the generator being aborted after', async () => {
    const abortController = new AbortController();
    const reason = Symbol('reason');
    const pusher = new EmptyAsyncGenerator({
      signal: abortController.signal,
    });
    expect(pusher.closed).toBe(false);
    const promise = pusher.next();
    abortController.abort(reason);
    expect(pusher.closed).toBe(true);
    expect(await promise).toStrictEqual({ done: true, value: reason });
  });

  test('the generator being aborted before', async () => {
    const abortController = new AbortController();
    const reason = Symbol('reason');
    abortController.abort(reason);
    const pusher = new EmptyAsyncGenerator({
      signal: abortController.signal,
    });
    expect(pusher.closed).toBe(true);
    const promise = pusher.next();
    expect(await promise).toStrictEqual({ done: true, value: undefined });
  });

  test('the generator to return like a GeneratorFunction', async () => {
    const returnValue = Symbol('returnValue');
    const spyA = vi.fn();
    const spyB = vi.fn();
    async function* generatorFn() {
      let i = 0;
      while (true) {
        yield i++;
      }
    }

    const generatorA = generatorFn();
    const generatorB = new EmptyAsyncGenerator();

    const returnPromiseA1 = generatorA.return(returnValue);
    const returnPromiseC1 = generatorB.return(returnValue);

    expect(await returnPromiseA1).toStrictEqual({
      done: true,
      value: returnValue,
    });
    expect(await returnPromiseC1).toStrictEqual(await returnPromiseA1);

    const returnPromiseA2 = generatorA.return();
    const returnPromiseC2 = generatorB.return();

    expect(await returnPromiseA2).toStrictEqual({
      done: true,
      value: undefined,
    });
    expect(await returnPromiseC2).toStrictEqual(await returnPromiseA2);

    const nextPromiseA3 = generatorA.next();
    const pusherPromise3 = generatorB.next(2);
    expect(await pusherPromise3).toStrictEqual({
      done: true,
      value: undefined,
    });
    expect(await nextPromiseA3).toStrictEqual(await pusherPromise3);

    for await (const result of generatorA) {
      spyA(result);
    }

    expect(spyA).not.toBeCalled();

    for await (const result of generatorB) {
      spyB(result);
    }

    expect(spyB).not.toBeCalled();
  });

  test('the generator to throw like a GeneratorFunction', async () => {
    const error1 = new Error('error1');
    const spyA = vi.fn();
    const spyB = vi.fn();
    async function* generatorFn() {
      let i = 0;
      while (true) {
        yield i++;
      }
    }

    const generatorA = generatorFn();
    const generatorB = new EmptyAsyncGenerator();

    await expect(generatorA.throw(error1)).rejects.toStrictEqual(error1);
    await expect(generatorB.throw(error1)).rejects.toStrictEqual(error1);

    const returnPromiseA2 = generatorA.return();
    const returnPromiseC2 = generatorB.return();

    expect(await returnPromiseA2).toStrictEqual({
      done: true,
      value: undefined,
    });
    expect(await returnPromiseC2).toStrictEqual(await returnPromiseA2);

    const nextPromiseA3 = generatorA.next();
    const pusherPromise3 = generatorB.next(2);
    expect(await pusherPromise3).toStrictEqual({
      done: true,
      value: undefined,
    });
    expect(await nextPromiseA3).toStrictEqual(await pusherPromise3);

    for await (const result of generatorA) {
      spyA(result);
    }

    expect(spyA).not.toBeCalled();

    for await (const result of generatorB) {
      spyB(result);
    }

    expect(spyB).not.toBeCalled();
  });
});
