import { race as originalRace } from 'async-iterators-combine';
import { flattenOrNot } from './flatten-or-not.js';

export const race = flattenOrNot(originalRace);
