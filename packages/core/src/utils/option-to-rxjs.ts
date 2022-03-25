// import * as O from 'fp-ts/Option'
// import * as IO from 'fp-ts/IO'
// import { of, throwError, from } from 'rxjs'
// import {CoreError,} from '../error/core.error'
// import * as F from 'fp-ts/function'

// export const optionToRxjs = <E extends Error, A>(onError?:IO.IO<E>) =>(e: O.Option<A>) => F.flow(
//   O.fold(
//     () => throwError(onError ?? (() =>CoreError.new(CoreErrorTag.UNKNOWN)) ),
//     (v) => of(v as A)
//   )
// )(e)
