import { vi, test, expect, describe } from 'vitest';
import { YieldableAsyncGenerator } from './yieldable-async-generator.js';

describe('yieldable-async-generator', () => {
  test('the generator to yield like a GeneratorFunction that returns', async () => {
    const spyA = vi.fn();
    const spyB = vi.fn();
    async function* generatorFn() {
      let i = 0;
      while (true) {
        yield i++;
        if (i > 5) {
          return;
        }
      }
    }

    const generatorA = generatorFn();
    const generatorB = new YieldableAsyncGenerator();

    const nextPromiseA1 = generatorA.next();
    const nextPromiseB1 = generatorB.next();
    generatorB.yield(0);
    expect(await nextPromiseA1).toStrictEqual({ done: false, value: 0 });
    expect(await nextPromiseB1).toStrictEqual(await nextPromiseA1);

    const nextPromiseA2 = generatorA.next();
    const nextPromiseB2 = generatorB.next();
    generatorB.yield(1);
    expect(await nextPromiseA2).toStrictEqual({ done: false, value: 1 });
    expect(await nextPromiseB2).toStrictEqual(await nextPromiseA2);

    const generatorC = (async function* () {
      for await (const i of generatorB) {
        spyB(i);
        yield i;
      }
    })();

    let promiseC;

    promiseC = generatorC.next();
    generatorB.yield(2);
    await promiseC;
    promiseC = generatorC.next();
    generatorB.yield(3);
    await promiseC;
    promiseC = generatorC.next();
    generatorB.yield(4);
    await promiseC;
    promiseC = generatorC.next();
    generatorB.yield(5);
    await promiseC;
    promiseC = generatorC.next();
    generatorB.return();

    await expect(promiseC).resolves.toStrictEqual({
      done: true,
      value: undefined,
    });

    for await (const i of generatorA) {
      spyA(i);
    }

    expect(spyA).toBeCalledTimes(4);
    expect(spyB).toBeCalledTimes(4);
    expect(() => generatorB.yield(6)).toThrowError(
      new Error('Trying to yield a value from a closed generator')
    );
  });

  test('the generator to yield like a GeneratorFunction that throws', async () => {
    const error1 = new Error('error1');
    const spyA = vi.fn();
    const spyB = vi.fn();
    async function* generatorFn() {
      let i = 0;
      while (true) {
        yield i++;
        if (i > 5) {
          throw error1;
        }
      }
    }

    const generatorA = generatorFn();
    const generatorB = new YieldableAsyncGenerator();

    const nextPromiseA1 = generatorA.next();
    const nextPromiseB1 = generatorB.next();
    generatorB.yield(0);
    expect(await nextPromiseA1).toStrictEqual({ done: false, value: 0 });
    expect(await nextPromiseB1).toStrictEqual(await nextPromiseA1);

    const nextPromiseA2 = generatorA.next();
    const nextPromiseB2 = generatorB.next();
    generatorB.yield(1);
    expect(await nextPromiseA2).toStrictEqual({ done: false, value: 1 });
    expect(await nextPromiseB2).toStrictEqual(await nextPromiseA2);

    const generatorC = (async function* () {
      for await (const i of generatorB) {
        spyB(i);
        yield i;
      }
    })();

    let promiseC;

    promiseC = generatorC.next();
    generatorB.yield(2);
    await promiseC;
    promiseC = generatorC.next();
    generatorB.yield(3);
    await promiseC;
    promiseC = generatorC.next();
    generatorB.yield(4);
    await promiseC;
    promiseC = generatorC.next();
    generatorB.yield(5);
    await promiseC;
    await Promise.all([
      expect(generatorC.next()).rejects.toStrictEqual(error1),
      expect(generatorB.throw(error1)).rejects.toStrictEqual(error1),
    ]);

    const promiseA = (async () => {
      for await (const i of generatorA) {
        spyA(i);
      }
    })();

    await expect(promiseA).rejects.toStrictEqual(error1);

    expect(spyA).toBeCalledTimes(4);
    expect(spyB).toBeCalledTimes(4);
    expect(() => generatorB.yield(6)).toThrowError(
      new Error('Trying to yield a value from a closed generator')
    );
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
    const generatorB = new YieldableAsyncGenerator();

    const nextPromiseA1 = generatorA.next();
    const nextPromiseB1 = generatorB.next();
    generatorB.yield(0);
    expect(await nextPromiseA1).toStrictEqual({ done: false, value: 0 });
    expect(await nextPromiseB1).toStrictEqual(await nextPromiseA1);

    const nextPromiseA2 = generatorA.next();
    const nextPromiseB2 = generatorB.next();
    generatorB.yield(1);
    expect(await nextPromiseA2).toStrictEqual({ done: false, value: 1 });
    expect(await nextPromiseB2).toStrictEqual(await nextPromiseA2);

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
    const generatorB = new YieldableAsyncGenerator();

    const nextPromiseA1 = generatorA.next();
    const nextPromiseB1 = generatorB.next();
    generatorB.yield(0);
    expect(await nextPromiseA1).toStrictEqual({ done: false, value: 0 });
    expect(await nextPromiseB1).toStrictEqual(await nextPromiseA1);

    const nextPromiseA2 = generatorA.next();
    const nextPromiseB2 = generatorB.next();
    generatorB.yield(1);

    expect(await nextPromiseA2).toStrictEqual({ done: false, value: 1 });
    expect(await nextPromiseB2).toStrictEqual(await nextPromiseA2);
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
