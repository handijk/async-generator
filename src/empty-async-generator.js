export class EmptyAsyncGenerator {
  #closed = false;
  #resolve = null;
  #reject = null;
  #promise = null;

  get closed() {
    return this.#closed;
  }

  constructor({ signal } = {}) {
    this.#promise = new Promise((resolve, reject) => {
      this.#resolve = resolve;
      this.#reject = reject;
    });
    if (signal) {
      if (signal.aborted) {
        this.#closed = true;
      } else {
        signal.addEventListener('abort', () => {
          this.#resolve({ value: signal.reason, done: true });
          this.#closed = true;
        });
      }
    }
  }

  next() {
    if (this.#closed) {
      return Promise.resolve({ value: undefined, done: true });
    }
    return this.#promise;
  }

  return(value) {
    this.#closed = true;
    return Promise.resolve({ value, done: true });
  }

  throw(error) {
    this.#closed = true;
    return Promise.reject(error);
  }

  [Symbol.asyncIterator]() {
    return this;
  }
}
