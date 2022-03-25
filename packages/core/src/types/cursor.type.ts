import * as t from 'io-ts';

export const type = t.type({
  after: t.union([t.string, t.undefined, t.null]),
  before: t.union([t.string, t.undefined, t.null]),
  limit: t.union([t.number, t.undefined, t.string]),
});

export type Cursor = t.OutputOf<typeof type>;
export type CursorType = t.TypeOf<typeof type>;
