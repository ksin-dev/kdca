import * as t from 'io-ts';
import {
  function as F,
  either as E,
} from 'fp-ts'
const regex = /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i;

export interface ObjectIdBrand {
  readonly ObjectId: unique symbol;
}

// export const type = t.brand(
//   {
//     ...t.string,
//     validate: (i, ctx) => {
//       console.log(i, ctx);
//     },
//     encode: (s) => s.toLowerCase(),
//   } as t.StringC,
//   (s): s is t.Branded<string, ObjectIdBrand> => regex.test(String(s)),
//   'ObjectId'
// );
export const type = new t.Type<string , string, unknown>(
  'ObjectId',
  // tslint:disable-next-line
  (u): u is string => typeof String(u)==='string',
  (u, c) => {
    const s = String(u);
    return regex.test(s) ? t.success(u as string): t.failure(u,c)
  },
  (s)=> String(s)
)



export type ObjectIdType = t.TypeOf<typeof type>;
export type ObjectId = t.OutputOf<typeof type>;
