import {
  ContextToken,
  createContextToken,
} from '../context/context.token.factory';
import * as Eq from 'fp-ts/Eq';
import * as F from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import { IOPort, Port } from './io-port';

export declare const URI = 'usecase';

export interface UseCase<I, O, R = any> {
  token: ContextToken<R>;
  port: IOPort<I, O>;
  _as: 'usecase';
}

export type UseCaseCreator<I, O, R = any> = (
  inputPort: I
) => [UseCase<I, O, R>, I];

export const createUseCase = <I, O, R = any>(
  name: string,
  port: IOPort<I, O>
): UseCaseCreator<I, O, R> => {
  const token = createContextToken<R>(name);
  return (inputPort: I): [UseCase<I, O, R>, I] => [
    {
      token,
      port,
      _as: 'usecase',
    },
    inputPort,
  ];
};
