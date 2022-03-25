import * as R from 'fp-ts/Reader';
import * as TE from 'fp-ts/TaskEither';
import { Context,  ContextToken } from '../context';

import {
  CoreError, NotFoundDependencyError,
} from '../error';
import { UseCase } from '../usecase';

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

export type UseResolver = <I, O>([useCase, input]: [UseCase<I, O, ResolverReader<I, O>>, I]) =>
(ctx: Context.Context) => TE.TaskEither<NotFoundDependencyError, UseResolverOutput<O>>