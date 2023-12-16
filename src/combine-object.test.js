import { describe, it, expect } from 'vitest';
import { combineObject } from './combine-object.js';

async function* generatorFn() {
  yield 1;
  yield 2;
  yield 3;
}

describe('combineObject', () => {
  it('will loop over an empty iterable', async () => {
    const args = [Symbol('arg1'), Symbol('arg2')];
    const generator = combineObject({})(...args);
    await expect(generator.next()).resolves.toStrictEqual({
      done: true,
      value: undefined,
    });
  });

  it('will loop over an iterable', async () => {
    const args = [Symbol('arg1'), Symbol('arg2')];
    const generator = combineObject({
      a: 1,
      b: async function* () {},
      c: async function* () {},
    })(...args);
    await expect(generator.next()).resolves.toStrictEqual({
      done: false,
      value: { a: 1, b: undefined, c: undefined },
    });
    await expect(generator.next()).resolves.toStrictEqual({
      done: true,
      value: undefined,
    });
  });

  it('will loop over an iterable', async () => {
    const args = [Symbol('arg1'), Symbol('arg2')];
    const combinedGenerator = combineObject(
      {
        a: (...args) => generatorFn(...args),
        b: (...args) => generatorFn(...args),
        c: (...args) => generatorFn(...args),
      },
      { eager: true }
    );
    const generator = combinedGenerator(...args);
    await expect(generator.next()).resolves.toStrictEqual({
      done: false,
      value: { a: 1, b: undefined, c: undefined },
    });
    await expect(generator.next()).resolves.toStrictEqual({
      done: false,
      value: { a: 1, b: 1, c: undefined },
    });
    await expect(generator.next()).resolves.toStrictEqual({
      done: false,
      value: { a: 1, b: 1, c: 1 },
    });
    await expect(generator.next()).resolves.toStrictEqual({
      done: false,
      value: { a: 2, b: 1, c: 1 },
    });
    await expect(generator.next()).resolves.toStrictEqual({
      done: false,
      value: { a: 2, b: 2, c: 1 },
    });
    await expect(generator.next()).resolves.toStrictEqual({
      done: false,
      value: { a: 2, b: 2, c: 2 },
    });
    await expect(generator.next()).resolves.toStrictEqual({
      done: false,
      value: { a: 3, b: 2, c: 2 },
    });
    await expect(generator.next()).resolves.toStrictEqual({
      done: false,
      value: { a: 3, b: 3, c: 2 },
    });
    await expect(generator.next()).resolves.toStrictEqual({
      done: false,
      value: { a: 3, b: 3, c: 3 },
    });
    await expect(generator.next()).resolves.toStrictEqual({
      done: true,
      value: undefined,
    });
  });
});
