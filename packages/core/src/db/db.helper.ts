import * as R from 'fp-ts/Reader';
import { Session,Transaction } from './transaction';
import { Nullable } from '../interface';
import { function as F, option as O, taskEither as TE } from 'fp-ts';
import { Code } from '../code';
import { CoreError, DatabaseError, EmptyEntityError } from '../error';
import { Port } from '../usecase';
import { taskEitherToRxjs } from '../utils';
import { TaskEither } from 'fp-ts/lib/TaskEither';

export type DBQuery<T, R> = R.Reader<
  T,
  R.Reader<Transaction, TE.TaskEither<CoreError, R>>
>;

export const createDBQuery =
  <T, R>(
    f: (value: T, client: Transaction) => TaskEither<unknown, Nullable<R> | undefined>,
    returnType: Port<unknown,R>
  ): DBQuery<T, Nullable<R> | R> =>
  (value: T) =>
  (session: any) =>
    F.pipe(
      f(value, session),
      TE.fold(
        (err: any) => {
          if (err instanceof CoreError) return TE.left(err);
          return TE.left(
            new DatabaseError({
              message: err?.message,
              stack: err?.stack,
              detail: '작업 중 오류가 발생했습니다 다시 시도해주세요.',
            })
          );
        },
        (v) => TE.right(v)
      ),
      TE.chain(
        F.flow(
          O.fromNullable,
          O.fold(
            () => TE.right(null),
            (r) => returnType(r) as any
          )
        )
      )
    );

export const createNotNullableDBQuery = <T, R>(
  f: (
    value: T,
    session: Transaction
  ) => TE.TaskEither<unknown, Nullable<R> | undefined>,
  returnType: Port<unknown,R>
): DBQuery<T, R> =>
  F.flow(
    createDBQuery(f, returnType),
    R.map(
      F.flow(
        TE.chain(
          F.flow(
            O.fromNullable,
            O.fold(() => TE.left(new EmptyEntityError()), TE.right)
          )
        )
      )
    )
  );
