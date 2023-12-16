import { test, expect, describe } from 'vitest';
import { pipe } from './pipe.js';

describe('pipe', () => {
  test('will pass any arguments to the first generator function', async () => {
    const arg1 = Symbol('arg1');
    const arg2 = Symbol('arg2');
    const generatorFn = pipe(async function* (arg1, arg2) {
      yield arg1;
      yield arg2;
    });
    const generator = generatorFn(arg1, arg2);
    await expect(generator.next()).resolves.toStrictEqual({
      done: false,
      value: arg1,
    });
    await expect(generator.next()).resolves.toStrictEqual({
      done: false,
      value: arg2,
    });
  });

  test('will pass the first generator to the second generator function', async () => {
    const arg1 = Symbol('arg1');
    const arg2 = Symbol('arg2');
    const generatorFn = pipe(
      async function* (arg1, arg2) {
        yield arg1;
        yield arg2;
      },
      async function* (generator) {
        for await (const arg of generator) {
          yield arg;
        }
      }
    );
    const generator = generatorFn(arg1, arg2);
    await expect(generator.next()).resolves.toStrictEqual({
      done: false,
      value: arg1,
    });
    await expect(generator.next()).resolves.toStrictEqual({
      done: false,
      value: arg2,
    });
  });
});
