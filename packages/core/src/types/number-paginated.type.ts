import * as t from 'io-ts';
import * as Pagination from './pagination.type';

export const numberPaginate = <P extends t.Props>(type: t.TypeC<P>) => {
  return t.type({
    pagination: Pagination.type,
    results: t.array(type),
  });
};

export interface NumberPaginated<T> {
  pagination: Pagination.Pagination;
  results: T[];
}
