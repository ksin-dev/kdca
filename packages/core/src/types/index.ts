export * from 'io-ts-types';
export * from './email.type';
export * from './create-enum-type';
export * from 'io-ts';
export * from './cursor-paginated.type';
import * as Cursor from './cursor.type';
export * as Pagination from './pagination.type';
export * as QueryPagination from './query-pagination.type';
export * from './number-paginated.type';
import * as t from 'io-ts';
export * as ObjectId from "./object-id.type";

export { Cursor };

const encode = (props: any) => (a: any):any => {
  if (typeof a !== 'object' || typeof props !=='object') return a;
  return Object.keys(props).reduce((p, n) => {
    p[n] = props[n]?.encode?.(a[n])
    return p;
  }, { } as any)
}
export const transformType = <P extends t.Props>(props: P, name?: string) => {
  const type = t.type(props, name);
  return {
    ...type,
    encode: (a: any) => {
      return encode(type.props)(a);
    },
  } as t.TypeC<P>;
};
// export * from "../@types/index"
