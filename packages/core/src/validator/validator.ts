import * as TE from 'fp-ts/TaskEither';
import * as t from 'io-ts';
import { CoreError, ValidationError } from '../error';
import { validator } from 'io-ts-validator';
import { z } from 'zod';
import * as F from 'fp-ts/function';

export const URI = 'Validator';

export interface Validator<I, O> {
  _as: typeof URI;
  validate: (value: I) => TE.TaskEither<CoreError, O>;
}

export const fromType = <A, O, I>(type: t.Type<A, O, I>): Validator<I,O> => {
  return {
    _as: URI,
    validate: (value: I) => {
      return F.pipe(
        TE.fromEither(validator(type).decodeEither(value)),
        TE.map(type.encode),
        TE.mapLeft((v) => new ValidationError({
          code: 'Validation Error',
          detail: v[0]
        }))
      )
    }
  }
}


export const fromZod = <T extends z.ZodType<any, any, any>>(
  type: T
): Validator<z.input<typeof type>, z.output<typeof type>> => {
  return {
    _as: URI,
    validate: (value: z.input<typeof type>) =>
      F.pipe(
        TE.tryCatch(
          () => type.parseAsync(value),
          (err: any) => {
            return new ValidationError({
              code: 'Validation Error',
              detail: err.issues[0].message,
            })
          }
        )
      ),
  };
};
