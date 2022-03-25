import * as t from 'io-ts';

export const type = t.type({
  page: t.union([t.number, t.undefined, t.string]),
  limit: t.union([t.number, t.undefined, t.string]),
  totalPage: t.union([t.number, t.undefined, t.string]),
  totalCount: t.union([t.number, t.undefined, t.string]),
});

export type Pagination = t.OutputOf<typeof type>;
export type PaginationType = t.TypeOf<typeof type>;
