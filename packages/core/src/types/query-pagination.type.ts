import * as t from 'io-ts';

export const type = t.type({
  page: t.union([t.number, t.undefined, t.string]),
  limit: t.union([t.number, t.undefined, t.string]),
});

export type QueryPagination = t.OutputOf<typeof type>;
export type QueryPaginationType = t.TypeOf<typeof type>;
