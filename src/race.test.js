import { describe, jest, test, expect } from '@jest/globals';
import raceModule from './race.js';
import { race } from './race.js';

describe('race', () => {
  async function* createAsyncIterable() {
    yield 1;
    yield 2;
    yield 3;
  }

  test('will combine race and create async generator', async () => {
    const x = Symbol();
    const options = Symbol();
    const input = [Symbol(), Symbol(), Symbol()];
    const mockedGenerator = Symbol();

    const originalRaceSpy = jest.spyOn(raceModule, 'originalRace');
    const createAsyncGeneratorSpy = jest.spyOn(
      raceModule,
      'createAsyncGenerator'
    );
    const generatorSpy = jest.fn(() => mockedGenerator);

    originalRaceSpy.mockReturnValueOnce(createAsyncIterable());
    createAsyncGeneratorSpy.mockReturnValue(generatorSpy);

    const asyncIterator = race(input, options)(x);

    expect(await asyncIterator.next()).toEqual({ done: false, value: 1 });
    expect(await asyncIterator.next()).toEqual({ done: false, value: 2 });
    expect(await asyncIterator.next()).toEqual({ done: false, value: 3 });
    expect(await asyncIterator.next()).toEqual({
      done: true,
      value: undefined,
    });

    expect(originalRaceSpy).toHaveBeenCalledTimes(1);
    expect(originalRaceSpy.mock.calls[0][0][0]).toBe(mockedGenerator);
    expect(originalRaceSpy.mock.calls[0][0][1]).toBe(mockedGenerator);
    expect(originalRaceSpy.mock.calls[0][0][2]).toBe(mockedGenerator);
    expect(originalRaceSpy.mock.calls[0][1]).toBe(options);
    expect(createAsyncGeneratorSpy).toHaveBeenCalledTimes(3);
    expect(createAsyncGeneratorSpy.mock.calls[0][0]).toBe(input[0]);
    expect(createAsyncGeneratorSpy.mock.calls[1][0]).toBe(input[1]);
    expect(createAsyncGeneratorSpy.mock.calls[2][0]).toBe(input[2]);
    expect(generatorSpy).toHaveBeenCalledTimes(3);
    expect(generatorSpy.mock.calls[0][0]).toBe(x);
    expect(generatorSpy.mock.calls[1][0]).toBe(x);
    expect(generatorSpy.mock.calls[2][0]).toBe(x);
  });
});
