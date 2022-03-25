import * as t from 'io-ts';
import * as Cursor from './cursor.type';

export const cursorPaginate = <P extends t.Props>(type: t.TypeC<P>) => {
  return t.type({
    cursor: Cursor.type,
    results: t.array(type),
  });
};

export interface CursorPaginated<T> {
  cursor: Cursor.Cursor;
  results: T[];
}
