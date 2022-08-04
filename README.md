# async-generator

Create an async generator out of any value and pipe async generators into each other.

* [Installation](#installation)
* [createAsyncGenerator usage](#createAsyncgenerator)
* [pipe usage](#pipe)
* [Operators](#operators)

## Installation

```
npm i create-async-generator
```

## creatAsyncGenerator usage

Passing a promise converts it into an async generator that will yield the promise result

```js
import { createAsyncGenerator } from 'create-async-generator';

const input = Promise.resolve(1);
const generator = createAsyncGenerator(input);

for await (const output of generator()) {
  console.log(output); //=> 1
}
```

Passing an async iterable will yield all of its values

```js
import { createAsyncGenerator } from 'create-async-generator';

async function* inputGenerator(value) {
  yield value * 2;
  yield value * 3;
  yield value * 4;
}

const input = inputGenerator(2);

const generator = createAsyncGenerator(input());

for await (const output of generator()) {
  console.log(output); //=> 4, 6, 8
}
```

Passed methods (including (async) generators) will be called with the generator arguments

```js
import { createAsyncGenerator } from 'create-async-generator';

async function* inputGenerator(value) {
  // value will be the generator argument
  yield value * 2;
  yield value * 3;
  yield value * 4;
}

const generator = createAsyncGenerator(inputGenerator);

for await (const output of generator(2)) {
  console.log(output); //=> 4, 6, 8
}
```

Any argument that is not a method, promise or async iterable will return a generator that will yield the same value

```js
import { createAsyncGenerator } from 'create-async-generator';

const input = 1;
const generator = createAsyncGenerator(input);

for await (const output of generator()) {
  console.log(output); //=> 1
}
```

All output is flattened by default, so nesting promises, async iterables and methods will all result in a generator that yields all output values

```js
import { createAsyncGenerator } from 'create-async-generator';

async function* inputGenerator(value) {
  // innerValue and value will be the generator argument
  yield Promise.resolve(value * 2);
  yield (innerValue) => innerValue * value * 3;
  yield async function* (innerValue) {
    yield innerValue * value * 2;
    yield innerValue * value * 3;
    yield innerValue * value * 4;
  };
}

const generator = createAsyncGenerator(inputGenerator);

for await (const output of generator(2)) {
  console.log(output); //=> 4, 12, 6, 12, 16
}
```

## pipe usage

The first argument is passed to `createAsyncGenerator` to convert the value to an async generator.
All other arguments are operators that get passed the resulting async iterable.

```js
import { pipe } from 'create-async-generator';

async function* inputGenerator(value) {
  yield value * 2;
  yield value * 3;
  yield value * 4;
}

const generator = pipe(inputGenerator, async function* (asyncIterable) {
  for await (const value of asyncIterable) {
    yield value / 2;
  }
});

for await (const output of generator(2)) {
  console.log(output); //=> 2, 3, 4
}
```

Because the output of the methods is passed to `createAsyncGenerator` and called with the generator arguments it is possible to return methods, (async) generators or plain values that will be converted into async iterables

```js
import { pipe } from 'create-async-generator';

async function* inputGenerator(value) {
  yield value * 2;
  yield value * 3;
  yield value * 4;
}

const generator = pipe(
  inputGenerator,
  async function* (asyncIterable) {
    for await (const value of asyncIterable) {
      yield value / 2;
    }
  },
  async function* (asyncIterable) {
    for await (const value of asyncIterable) {
      // innerValue will be the generator argument
      yield async function* (innerValue) {
        yield innerValue * value * 2;
        yield innerValue * value * 3;
        yield innerValue * value * 4;
      } 
    }
  }
);

for await (const output of generator(2)) {
  console.log(output); //=> 8, 12, 16, 12, 18, 24, 16, 24, 32
}
```

## Operators

This library provides two default operators, `map` and `filter`, both take a predicate method that will get the yielded value and an index as arguments

```js
import { pipe, map } from 'create-async-generator';

async function* inputGenerator(value) {
  yield value * 2;
  yield value * 3;
  yield value * 4;
}

const generator = pipe(
  inputGenerator,
  map((value, i) => value / 2 * i),
);

for await (const output of generator(2)) {
  console.log(output); //=> 0, 3, 8 
}
```

```js
import { pipe, filter } from 'create-async-generator';

async function* inputGenerator(value) {
  yield 2;
  yield 3;
  yield 4;
  yield 5;
  yield 6;
}

const generator = pipe(
  inputGenerator,
  filter((value, i) => value % 2 === 0),
);

for await (const output of generator(2)) {
  console.log(output); //=> 2, 4, 6 
}
```
