import { all as originalAll } from 'async-iterators-combine';
import { flattenOrNot } from './flatten-or-not.js';

export const all = flattenOrNot(originalAll);
