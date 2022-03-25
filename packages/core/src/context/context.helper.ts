import * as T from 'fp-ts/lib/Task';
import * as O from 'fp-ts/lib/Option';
import * as IO from 'fp-ts/lib/IO';
import { pipe } from 'fp-ts/function';
import { constant } from 'fp-ts/lib/function';
import {
  registerAll,
  BoundDependency,
  createContext,
  bindTo,
  resolve,
  Context,
  lookup,
  DerivedContextToken,
} from './context';
import { ContextToken } from './context.token.factory';

export const constructContext =
  (context?: Context) =>
  (...dependencies: BoundDependency<any>[]): Promise<Context> =>
    pipe(
      context ?? createContext(),
      registerAll([...dependencies]),
      (context) => () => resolve(context)
    )();

export const useContext =
  <T>(token: ContextToken<T>) =>
  (context?: Context): null | T =>
    pipe(
      lookup(context as Context)(token),
      O.fold(
        () => {
          console.error(`can not found ${token.name}`);
          return null;
        },
        (dependency) => dependency
      )
    );

export const contextFactory = constructContext();
