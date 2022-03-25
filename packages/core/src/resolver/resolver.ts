import { UseCase, UseCaseCreator } from '../usecase';
import {
  bindTo,
  lookup,
  lookups,
} from '../context/context';
import * as O from 'fp-ts/Option';
import * as F from 'fp-ts/function';
import * as R from 'fp-ts/Reader';
import * as TE from 'fp-ts/TaskEither';
import { Context, contextFactory, ContextToken } from '../context';
import { CommonDITokens } from '../di';
import { DB, Transaction } from '../db';
import {
  CoreError,
  NotFoundDependencyError,
} from '../error';
import {
    Resolve,
    Resolver,
    ResolverReader,
    UseResolver,
    UseResolverOutput
 } from "./resolver.interface";


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



