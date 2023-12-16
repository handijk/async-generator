import { describe, it, expect } from 'vitest';
import { combineIterable } from './combine-iterable.js';

async function* generatorFn() {
  yield 1;
  yield 2;
  yield 3;
}

describe('combineIterable', () => {
  it('will loop over an empty iterable', async () => {
    const args = [Symbol('arg1'), Symbol('arg2')];
    const generator = combineIterable([])(...args);
    await expect(generator.next()).resolves.toStrictEqual({
      done: true,
      value: undefined,
    });
  });

  it('will loop over an iterable', async () => {
    const args = [Symbol('arg1'), Symbol('arg2')];
    const generator = combineIterable([
      1,
      async function* () {},
      async function* () {},
    ])(...args);
    await expect(generator.next()).resolves.toStrictEqual({
      done: false,
      value: [1, undefined, undefined],
    });
    await expect(generator.next()).resolves.toStrictEqual({
      done: true,
      value: undefined,
    });
  });

  it('will loop over an iterable', async () => {
    const args = [Symbol('arg1'), Symbol('arg2')];
    const combinedGenerator = combineIterable(
      Array.apply(null, Array(3)).map((...args) => generatorFn(...args)),
      { eager: true }
    );
    const generator = combinedGenerator(...args);
    await expect(generator.next()).resolves.toStrictEqual({
      done: false,
      value: [1, undefined, undefined],
    });
    await expect(generator.next()).resolves.toStrictEqual({
      done: false,
      value: [1, 1, undefined],
    });
    await expect(generator.next()).resolves.toStrictEqual({
      done: false,
      value: [1, 1, 1],
    });
    await expect(generator.next()).resolves.toStrictEqual({
      done: false,
      value: [2, 1, 1],
    });
    await expect(generator.next()).resolves.toStrictEqual({
      done: false,
      value: [2, 2, 1],
    });
    await expect(generator.next()).resolves.toStrictEqual({
      done: false,
      value: [2, 2, 2],
    });
    await expect(generator.next()).resolves.toStrictEqual({
      done: false,
      value: [3, 2, 2],
    });
    await expect(generator.next()).resolves.toStrictEqual({
      done: false,
      value: [3, 3, 2],
    });
    await expect(generator.next()).resolves.toStrictEqual({
      done: false,
      value: [3, 3, 3],
    });
    await expect(generator.next()).resolves.toStrictEqual({
      done: true,
      value: undefined,
    });
  });

  it('will loop over an iterable nested', async () => {
    const args = [Symbol('arg1'), Symbol('arg2')];
    const combinedGenerator1 = combineIterable(
      Array.apply(null, Array(3)).map((...args) => generatorFn(...args)),
      { eager: true }
    );
    const combinedGenerator2 = combineIterable(
      Array.apply(null, Array(3)).map((...args) => generatorFn(...args)),
      { eager: true }
    );
    const combinedGenerator3 = combineIterable(
      Array.apply(null, Array(3)).map((...args) => generatorFn(...args)),
      { eager: true }
    );
    const combinedGenerator = combineIterable(
      [combinedGenerator1, combinedGenerator2, combinedGenerator3],
      { eager: true }
    );
    const generator = combinedGenerator(...args);
    await expect(generator.next()).resolves.toStrictEqual({
      done: false,
      value: [[1, undefined, undefined], undefined, undefined],
    });
    await expect(generator.next()).resolves.toStrictEqual({
      done: false,
      value: [[1, 1, undefined], [1, undefined, undefined], undefined],
    });
    await expect(generator.next()).resolves.toStrictEqual({
      done: false,
      value: [
        [1, 1, undefined],
        [1, 1, undefined],
        [1, undefined, undefined],
      ],
    });
    await expect(generator.next()).resolves.toStrictEqual({
      done: false,
      value: [
        [1, 1, undefined],
        [1, 1, undefined],
        [1, 1, undefined],
      ],
    });
    await expect(generator.next()).resolves.toStrictEqual({
      done: false,
      value: [
        [1, 1, 1],
        [1, 1, undefined],
        [1, 1, undefined],
      ],
    });
    await expect(generator.next()).resolves.toStrictEqual({
      done: false,
      value: [
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, undefined],
      ],
    });
    await expect(generator.next()).resolves.toStrictEqual({
      done: false,
      value: [
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1],
      ],
    });
    await expect(generator.next()).resolves.toStrictEqual({
      done: false,
      value: [
        [2, 1, 1],
        [1, 1, 1],
        [1, 1, 1],
      ],
    });
    await expect(generator.next()).resolves.toStrictEqual({
      done: false,
      value: [
        [2, 1, 1],
        [2, 1, 1],
        [1, 1, 1],
      ],
    });
    await expect(generator.next()).resolves.toStrictEqual({
      done: false,
      value: [
        [2, 1, 1],
        [2, 1, 1],
        [2, 1, 1],
      ],
    });
    await expect(generator.next()).resolves.toStrictEqual({
      done: false,
      value: [
        [2, 2, 1],
        [2, 1, 1],
        [2, 1, 1],
      ],
    });
    await expect(generator.next()).resolves.toStrictEqual({
      done: false,
      value: [
        [2, 2, 1],
        [2, 2, 1],
        [2, 1, 1],
      ],
    });
    await expect(generator.next()).resolves.toStrictEqual({
      done: false,
      value: [
        [2, 2, 1],
        [2, 2, 1],
        [2, 2, 1],
      ],
    });
    await expect(generator.next()).resolves.toStrictEqual({
      done: false,
      value: [
        [2, 2, 2],
        [2, 2, 1],
        [2, 2, 1],
      ],
    });
    await expect(generator.next()).resolves.toStrictEqual({
      done: false,
      value: [
        [2, 2, 2],
        [2, 2, 2],
        [2, 2, 1],
      ],
    });
    await expect(generator.next()).resolves.toStrictEqual({
      done: false,
      value: [
        [2, 2, 2],
        [2, 2, 2],
        [2, 2, 2],
      ],
    });
    await expect(generator.next()).resolves.toStrictEqual({
      done: false,
      value: [
        [3, 2, 2],
        [2, 2, 2],
        [2, 2, 2],
      ],
    });
    await expect(generator.next()).resolves.toStrictEqual({
      done: false,
      value: [
        [3, 2, 2],
        [3, 2, 2],
        [2, 2, 2],
      ],
    });
    await expect(generator.next()).resolves.toStrictEqual({
      done: false,
      value: [
        [3, 2, 2],
        [3, 2, 2],
        [3, 2, 2],
      ],
    });
    await expect(generator.next()).resolves.toStrictEqual({
      done: false,
      value: [
        [3, 3, 2],
        [3, 2, 2],
        [3, 2, 2],
      ],
    });
    await expect(generator.next()).resolves.toStrictEqual({
      done: false,
      value: [
        [3, 3, 2],
        [3, 3, 2],
        [3, 2, 2],
      ],
    });
    await expect(generator.next()).resolves.toStrictEqual({
      done: false,
      value: [
        [3, 3, 2],
        [3, 3, 2],
        [3, 3, 2],
      ],
    });
    await expect(generator.next()).resolves.toStrictEqual({
      done: false,
      value: [
        [3, 3, 3],
        [3, 3, 2],
        [3, 3, 2],
      ],
    });
    await expect(generator.next()).resolves.toStrictEqual({
      done: false,
      value: [
        [3, 3, 3],
        [3, 3, 3],
        [3, 3, 2],
      ],
    });
    await expect(generator.next()).resolves.toStrictEqual({
      done: false,
      value: [
        [3, 3, 3],
        [3, 3, 3],
        [3, 3, 3],
      ],
    });
    await expect(generator.next()).resolves.toStrictEqual({
      done: false,
      value: [
        [3, 3, 3],
        [3, 3, 3],
        [3, 3, 3],
      ],
    });
    await expect(generator.next()).resolves.toStrictEqual({
      done: false,
      value: [
        [3, 3, 3],
        [3, 3, 3],
        [3, 3, 3],
      ],
    });
    await expect(generator.next()).resolves.toStrictEqual({
      done: true,
      value: undefined,
    });
  });
});
