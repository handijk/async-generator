import { test, expect, describe } from 'vitest';
import { ShareableAsyncGenerator } from './shareable-async-generator.js';

describe('shareable-async-generator', () => {
  test('waits for values to be pushed and then returns', async () => {
    const returnValue = Symbol('returnValue');
    async function* generatorFn() {
      let i = 0;
      while (true) {
        yield i++;
      }
    }

    const generatorA = generatorFn();
    const pusher = new ShareableAsyncGenerator();
    const generatorB = pusher.share();

    const nextPromiseA1 = generatorA.next();
    const nextPromiseB1 = generatorB.next();
    const pusherPromise1 = pusher.next();
    pusher.yield(0);
    expect(await pusherPromise1).toStrictEqual({ done: false, value: 0 });
    expect(await nextPromiseA1).toStrictEqual(await pusherPromise1);
    expect(await nextPromiseB1).toStrictEqual(await pusherPromise1);

    const nextPromiseA2 = generatorA.next();
    const nextPromiseB2 = generatorB.next();
    const pusherPromise2 = pusher.next();
    pusher.yield(1);
    expect(await pusherPromise2).toStrictEqual({ done: false, value: 1 });
    expect(await nextPromiseA2).toStrictEqual(await pusherPromise2);
    expect(await nextPromiseB2).toStrictEqual(await pusherPromise2);

    const pusherPromise3 = pusher.next();
    const returnPromiseA1 = generatorA.return(returnValue);
    const returnPromiseB1 = generatorB.return(returnValue);
    const returnPromiseC1 = pusher.return(returnValue);

    expect(await returnPromiseA1).toStrictEqual({
      done: true,
      value: returnValue,
    });
    expect(await returnPromiseB1).toStrictEqual(await returnPromiseA1);
    expect(await returnPromiseC1).toStrictEqual(await returnPromiseA1);
    expect(await pusherPromise3).toStrictEqual({
      done: true,
      value: returnValue,
    });

    const returnPromiseA2 = generatorA.return();
    const returnPromiseB2 = generatorB.return();
    const returnPromiseC2 = pusher.return();

    expect(await returnPromiseA2).toStrictEqual({
      done: true,
      value: undefined,
    });
    expect(await returnPromiseB2).toStrictEqual(await returnPromiseA2);
    expect(await returnPromiseC2).toStrictEqual(await returnPromiseA2);

    const nextPromiseA3 = generatorA.next();
    const nextPromiseB3 = generatorB.next();
    const pusherPromise4 = pusher.next();
    expect(() => pusher.yield(2)).toThrowError(
      new Error('Trying to yield a value from a closed generator')
    );
    expect(await pusherPromise4).toStrictEqual({
      done: true,
      value: undefined,
    });
    expect(await nextPromiseA3).toStrictEqual(await pusherPromise4);
    expect(await nextPromiseB3).toStrictEqual(await pusherPromise4);
  });

  test('waits for values to be pushed and then throws', async () => {
    const error1 = new Error('error1');
    async function* generatorFn() {
      let i = 0;
      while (true) {
        yield i++;
      }
    }

    const generatorA = generatorFn();
    const pusher = new ShareableAsyncGenerator();
    const generatorB = pusher.share();

    const nextPromiseA1 = generatorA.next();
    const nextPromiseB1 = generatorB.next();
    const pusherPromise1 = pusher.next();
    pusher.yield(0);
    expect(await pusherPromise1).toStrictEqual({ done: false, value: 0 });
    expect(await nextPromiseA1).toStrictEqual(await pusherPromise1);
    expect(await nextPromiseB1).toStrictEqual(await pusherPromise1);

    const nextPromiseA2 = generatorA.next();
    const nextPromiseB2 = generatorB.next();
    const pusherPromise2 = pusher.next();
    pusher.yield(1);
    expect(await pusherPromise2).toStrictEqual({ done: false, value: 1 });
    expect(await nextPromiseA2).toStrictEqual(await pusherPromise2);
    expect(await nextPromiseB2).toStrictEqual(await pusherPromise2);

    const pusherPromise3 = pusher.next();
    await expect(generatorA.throw(error1)).rejects.toStrictEqual(error1);
    await expect(generatorB.throw(error1)).rejects.toStrictEqual(error1);
    await expect(pusher.throw(error1)).rejects.toStrictEqual(error1);
    await expect(pusherPromise3).rejects.toStrictEqual(error1);

    const returnPromiseA2 = generatorA.return();
    const returnPromiseB2 = generatorB.return();
    const returnPromiseC2 = pusher.return();

    expect(await returnPromiseA2).toStrictEqual({
      done: true,
      value: undefined,
    });
    expect(await returnPromiseB2).toStrictEqual(await returnPromiseA2);
    expect(await returnPromiseC2).toStrictEqual(await returnPromiseA2);

    const nextPromiseA3 = generatorA.next();
    const nextPromiseB3 = generatorB.next();
    const pusherPromise4 = pusher.next();
    expect(() => pusher.yield(2)).toThrowError(
      new Error('Trying to yield a value from a closed generator')
    );
    expect(await pusherPromise4).toStrictEqual({
      done: true,
      value: undefined,
    });
    expect(await nextPromiseA3).toStrictEqual(await pusherPromise4);
    expect(await nextPromiseB3).toStrictEqual(await nextPromiseA3);
  });
});
