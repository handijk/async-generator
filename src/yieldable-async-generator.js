import { EmptyAsyncGenerator } from './empty-async-generator.js';

export class YieldableAsyncGenerator extends EmptyAsyncGenerator {
  #resolve = null;
  #reject = null;
  #promise = null;

  #setPromise() {
    this.#promise = new Promise((resolve, reject) => {
      this.#resolve = resolve;
      this.#reject = reject;
    });
  }

  yield(value) {
    if (this.closed) {
      throw new Error('Trying to yield a value from a closed generator');
    }
    this.#resolve({ value, done: false });
    this.#promise = null;
  }

  next() {
    if (!this.#promise) {
      this.#setPromise();
    }
    return Promise.race([super.next(), this.#promise]);
  }

  return(value) {
    if (this.#promise) {
      this.#resolve({ value, done: true });
    }
    return super.return(value);
  }

  throw(error) {
    if (this.#promise) {
      this.#reject(error);
    }
    return super.throw(error);
  }
}
