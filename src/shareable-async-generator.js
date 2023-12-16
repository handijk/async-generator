import { AsyncIteratorsCombine } from 'async-iterators-combine/async-iterators-combine.js';
import { EmptyAsyncGenerator } from './empty-async-generator.js';
import { YieldableAsyncGenerator } from './yieldable-async-generator.js';

export class ShareableAsyncGenerator extends YieldableAsyncGenerator {
  share({ signal } = {}) {
    const generator = new EmptyAsyncGenerator({
      signal,
    });
    return new AsyncIteratorsCombine([generator, this], {
      method: 'race',
      lazy: true,
      returnAsyncIterators: [generator],
    });
  }
}
