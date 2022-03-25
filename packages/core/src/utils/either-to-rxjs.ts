import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { of, throwError, from } from 'rxjs';
import * as F from 'fp-ts/function';
import { concatMap } from 'rxjs/operators';

export const eitherToRxjs = <E, A>(e: E.Either<E, A>) =>
  F.flow(
    E.fold(
      (e) => throwError(e as E),
      (v) => of(v as A)
    )
  )(e);

export const taskEitherToRxjs = <E, A>(e: TE.TaskEither<E, A>) =>
  from(e()).pipe(concatMap((e) => eitherToRxjs(e)));
