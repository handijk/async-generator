export const pipe =
  (...fns) =>
  (...x) => {
    const [generator] = fns.reduce((y, fn) => [fn(...y), ...x], x);
    return generator;
  };
