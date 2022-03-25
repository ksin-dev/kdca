import { Validator, URI } from '../validator/validator';
import { taskEither as TE, reader, io, function as F } from 'fp-ts';
import { CoreError } from '../error';

export type Port<I,O=I> = reader.Reader<I, TE.TaskEither<CoreError, O>>;
export interface IOPort<I, O> {
  _as: 'IOPort';
  i: Port<I>;
  o: Port<O>;
}

export const makeIOPort = <I, O>(i: Port<unknown,I>, o: Port<unknown,O>): IOPort<I, O> => ({
  _as: 'IOPort',
  i,
  o,
});

export const createPort =
  <I>(): Port<I> =>
  (input: I) =>
      TE.of<CoreError, I>(input);
    
export const createValidatorPort =
  <I,O=I>(validator: Validator<I, O>): Port<I,O> =>
  (input: I) => {
    console.log('input', input);
    return validator.validate(input);
  };

export const EMPTY_PORT = createPort<never | undefined>();
export const NULL_PORT = createPort<null>();
