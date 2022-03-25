import * as R from 'fp-ts/lib/Reader';
import * as M from 'fp-ts/lib/Map';
import * as O from 'fp-ts/lib/Option';
import * as E from 'fp-ts/lib/Eq';
import * as T from 'fp-ts/lib/Task';
import * as RA from 'fp-ts/lib/ReadonlyArray';

import { pipe } from 'fp-ts/function';
import { contramap, ordString, Ord } from 'fp-ts/Ord';
import { ContextToken, createContextToken } from './context.token.factory';

export const ordContextToken: Ord<ContextToken<unknown>> = contramap(
  (t: ContextToken<unknown>) => t._id
)(ordString);
export const setoidContextToken: E.Eq<ContextToken> = {
  equals: ordContextToken.equals,
};

export type Context = Map<ContextToken, ContextDependency | any>;

export interface ContextProvider {
  <T>(token: ContextToken<T>): O.Option<T>;
}

export type ContextReader = R.Reader<Context, any>;

export enum ContextReaderTag {
  EAGER_READER,
  LAZY_READER,
}

export interface ContextEagerReader {
  tag: ContextReaderTag.EAGER_READER;
  eval: ContextReader;
}

export interface ContextLazyReader {
  tag: ContextReaderTag.LAZY_READER;
  eval: () => ContextReader;
}

export type ContextDependency = ContextEagerReader | ContextLazyReader;

export interface BoundDependency<
  T,
  U extends ContextDependency = ContextDependency
> {
  token: ContextToken<T>;
  dependency: U;
}

export const DerivedContextToken =
  createContextToken<Context>('DerivedContext');

const isEagerDependency = (x: any): x is ContextEagerReader => {
  return Boolean(x.eval && x.tag === ContextReaderTag.EAGER_READER);
};

const isLazyDependency = (x: any): x is ContextLazyReader => {
  return Boolean(x.eval && x.tag === ContextReaderTag.LAZY_READER);
};

export const createContext = () => new Map();

export const register =
  <T>(boundDependency: BoundDependency<T, ContextDependency>) =>
  (context: Context): Context =>
    M.upsertAt(setoidContextToken)(
      boundDependency.token,
      boundDependency.dependency
    )(context);

export const registerAll =
  (boundDependencies: BoundDependency<any, any>[]) =>
  (context: Context): Context =>
    boundDependencies.reduce(
      (ctx, dependency) => register(dependency)(ctx),
      context
    );

export const unregister =
  (token: ContextToken) =>
  (context: Context): Context =>
    M.deleteAt(setoidContextToken)(token)(context);

export const resolve = async (context: Context): Promise<Context> => {
  const resolveEagerDependency = ({
    token,
    dependency,
  }: BoundDependency<unknown, ContextEagerReader>): T.Task<Context> =>
    pipe(
      () => pipe(context, dependency.eval, (d) => Promise.resolve(d)),
      T.chain((resolvedDependency) =>
        T.fromIO(() => context.set(token, resolvedDependency))
      )
    );

  for (const [token, dependency] of context) {
    if (!isEagerDependency(dependency)) continue;
    await resolveEagerDependency({ token, dependency })();
  }

  return context;
};

export const lookup =
  (context: Context) =>
  <T>(token: ContextToken<T>): O.Option<T> =>
    pipe(
      M.lookup(ordContextToken)(token, context),
      O.map((dependency) => {
        if (!dependency.eval) return dependency;

        const boostrapedDependency = isLazyDependency(dependency)
          ? dependency.eval()(context)
          : dependency.eval(context);

        context.set(token, boostrapedDependency);

        return boostrapedDependency;
      }),
      O.fold(
        () =>
          pipe(
            M.lookup(ordContextToken)(DerivedContextToken, context),
            O.chain((derivedContext: Context) => lookup(derivedContext)(token))
          ),
        O.some
      )
    );

export function lookups<A>(a: ContextToken<A>): (ctx: Context) => O.Option<[A]>;
export function lookups<A, B>(
  a: ContextToken<A>,
  b: ContextToken<B>
): (ctx: Context) => O.Option<[A, B]>;
export function lookups<A, B, C>(
  a: ContextToken<A>,
  b: ContextToken<B>,
  c: ContextToken<C>
): (ctx: Context) => O.Option<[A, B, C]>;
export function lookups<A, B, C, D>(
  a: ContextToken<A>,
  b: ContextToken<B>,
  c: ContextToken<C>,
  d: ContextToken<D>
): (ctx: Context) => O.Option<[A, B, C, D]>;
export function lookups<A, B, C, D, E>(
  a: ContextToken<A>,
  b: ContextToken<B>,
  c: ContextToken<C>,
  d: ContextToken<D>,
  e: ContextToken<E>
): (ctx: Context) => O.Option<[A, B, C, D, E]>;
export function lookups<A, B, C, D, E, F>(
  a: ContextToken<A>,
  b: ContextToken<B>,
  c: ContextToken<C>,
  d: ContextToken<D>,
  e: ContextToken<E>,
  f: ContextToken<F>
): (ctx: Context) => O.Option<[A, B, C, D, E, F]>;
export function lookups<A, B, C, D, E, F, G>(
  a: ContextToken<A>,
  b: ContextToken<B>,
  c: ContextToken<C>,
  d: ContextToken<D>,
  e: ContextToken<E>,
  f: ContextToken<F>,
  g: ContextToken<G>
): (ctx: Context) => O.Option<[A, B, C, D, E, F, G]>;
export function lookups(...tokens: any[]) {
  return (context: any) =>
    pipe(
      tokens,
      RA.map((token) => lookup(context)(token)),
      O.sequenceArray
    );
}

export const bindLazilyTo =
  <T>(token: ContextToken<T>) =>
  <U extends ContextReader>(
    dependency: U
  ): BoundDependency<T, ContextLazyReader> => ({
    token,
    dependency: { eval: () => dependency, tag: ContextReaderTag.LAZY_READER },
  });

export const bindEagerlyTo =
  <T>(token: ContextToken<T>) =>
  <U extends ContextReader>(
    dependency: U
  ): BoundDependency<T, ContextEagerReader> => ({
    token,
    dependency: { eval: dependency, tag: ContextReaderTag.EAGER_READER },
  });

export const bindTo = bindLazilyTo;

export const reader = pipe(R.ask<Context>(), R.map(lookup));
