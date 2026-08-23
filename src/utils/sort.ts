import { Temporal } from 'temporal-polyfill';

export const sortDateAsc = (a: string, b: string): number => Temporal.Instant.compare(a, b);

export const sortDateDesc = (a: string, b: string): number => Temporal.Instant.compare(b, a);
