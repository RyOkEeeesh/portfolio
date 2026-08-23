import { Temporal } from 'temporal-polyfill';

export const fmtDate = (date: string): string =>
  Temporal.Instant.from(date).toZonedDateTimeISO('Asia/Tokyo').toLocaleString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
