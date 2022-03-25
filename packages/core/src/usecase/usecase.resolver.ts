import { Observable, throwError } from 'rxjs';
import { concatMap, map, tap, concatMapTo, catchError } from 'rxjs/operators';
import { UseCase, UseCaseCreator } from './usecase';
// import * as R from 'fp-ts/Reader'
import { of, Subject, from } from 'rxjs';
import {
  bindTo,
  ContextReader,
  createContext,
  lookup,
  lookups,
} from '../context/context';
import * as O from 'fp-ts/Option';
import * as F from 'fp-ts/function';
import * as R from 'fp-ts/Reader';
import * as TE from 'fp-ts/TaskEither';
import * as T from 'fp-ts/Task';
import * as IO from 'fp-ts/IO';
import * as A from 'fp-ts/Array';
import { Context, contextFactory, ContextToken } from '../context';
import { CommonDITokens } from '../di';
import { DB, Transaction } from '../db';
import {
  CoreError,
  NotFoundDependencyError,
} from '../error';

export type Resolve<I, O, R> = (input: I) => TE.TaskEither<CoreError, O>;
export interface Resolver<I, O> {
  resolve: Resolve<I, O, Resolver<I, O>>;
}

export interface UseResolverOutput<O> {
  token: ContextToken<any>;
  output: O;
  _as: 'UseResolverOutPut';
}

export type ResolverReader<
  I,
  O,
  R extends Resolver<I, O> = Resolver<I, O>
> = R.Reader<Context.Context, R>;

export const fromResolve = <I, O>(
  resolve: Resolve<I, O, Resolver<I, O>>
): Resolver<I, O> => ({
  resolve,
});

export const createResolver = <I, O>(
  creator: UseCaseCreator<I, O, ResolverReader<I, O>>,
  resolve: (ctx: Context.Context, input: I) => TE.TaskEither<CoreError, O>
) => {
  const [usecase] = creator({} as any);
  const token = usecase.token;

  return bindTo(token)(
    (): ResolverReader<I, O> => (ctx: Context.Context) =>
      fromResolve<I, O>((input) =>
        F.pipe(
          usecase.port.i(input),
          TE.chain((input) => resolve(ctx, input)),
          TE.chain((output) => usecase.port.o(output))
        )
      )
  );
};

export const useTransactionalResolver =
  <I, O>([useCase, input]: [UseCase<I, O, ResolverReader<I, O>>, I]) =>
  (ctx: Context.Context) => F.pipe(
    lookups(
      CommonDITokens.Transaction,
      useCase.token
    )(ctx),
    O.map(([tr,resolver]) => F.pipe(
      tr.createSession(),
      TE.chain((newTr) => {
        const newCtx:Context.Context = F.flow(
          Context.register(Context.bindTo(CommonDITokens.Transaction)(() => newTr)),
          Context.register(Context.bindTo(CommonDITokens.DB)(()=>DB.of(newTr)))
        )(ctx);
        return newTr.start((session) =>
          F.pipe(
            resolver(newCtx).resolve(input),
            TE.map(
              (v) =>
              ({
                output: v,
                token: useCase.token,
                _as: 'UseResolverOutPut',
              } as UseResolverOutput<O>)
            )
          )
        )
      }),
    )),
    O.getOrElse(() =>
      TE.left(
        new NotFoundDependencyError({
          message: useCase.token.name,
        })
      )
    )
  )

export const useResolver =
  <I, O>([useCase, input]: [UseCase<I, O, ResolverReader<I, O>>, I]) =>
  (ctx: Context.Context) => {
    return F.pipe(
      lookup(ctx)(useCase.token),
      O.map((v) =>
        F.pipe(
          v(ctx).resolve(input),
          TE.map(
            (v) =>
              ({
                output: v,
                token: useCase.token,
                _as: 'UseResolverOutPut',
              } as UseResolverOutput<O>)
          )
        )
      ),
      O.getOrElse(() =>
        TE.left(
          new NotFoundDependencyError({
            message: useCase.token.name,
          })
        )
      )
    );
  };

