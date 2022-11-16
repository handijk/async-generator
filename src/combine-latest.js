import { combineLatest as originalCombineLatest } from 'async-iterators-combine';
import { flattenOrNot } from './flatten-or-not.js';

export const combineLatest = flattenOrNot(originalCombineLatest);
