export class RaceMapAbortError extends Error {
  static name = 'AbortError';
  name = RaceMapAbortError.name;
}

export const raceMap = (fn) =>
  async function* (asyncIterable, ...args) {
    let i = 0;
    let abortController;
    let nextResult = asyncIterable.next();
    while (true) {
      const { value, done } = await nextResult;
      if (abortController) {
        abortController.abort(
          new RaceMapAbortError(
            `Signal aborted by switchMap ${done ? 'return' : 'yield'}`
          )
        );
      }
      if (done) {
        return value;
      }
      abortController = new AbortController();
      let mappedResult;
      const result = await Promise.race([
        Promise.resolve(
          (mappedResult = fn(value, i++, abortController.signal, ...args))
        ).then((value) => ({ value, done: false, mapped: true })),
        (nextResult = asyncIterable.next()),
      ]);
      if (result.done) {
        yield mappedResult;
        if (abortController) {
          abortController.abort(
            new RaceMapAbortError('Signal aborted by switchMap return')
          );
        }
        return result.value;
      }
      if (result.mapped) {
        yield result.value;
      }
    }
  };
