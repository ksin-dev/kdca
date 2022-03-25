import * as TE from 'fp-ts/TaskEither';
import { CoreError } from '../error/core.error';
import { Nullable } from '../interface/nullable.interface';
export type Session<T = unknown> = T;

export interface Transaction<T = unknown> {
  _session: Nullable<Session<T>>;
  createSession: () => TE.TaskEither<CoreError,Transaction<T>>;
  start: <R = unknown>(
    f: (session: Session<T>) => TE.TaskEither<CoreError, R>
  ) => TE.TaskEither<CoreError, R>;
  // end: <T,R>(f:(session: Session<T>) => Observable<R>) => TE.TaskEither<Error,Transaction<T>>,
  isActive: () => boolean;
}
