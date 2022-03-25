import {
  createResolver,
  useResolver,
} from './usecase.resolver';
import { UseCase, URI, createUseCase } from './usecase';
import { fromType } from '../validator/validator';
import { createPort, createValidatorPort, makeIOPort } from './io-port';
import { of, combineLatest, from, concatMap } from 'rxjs';
import { contextFactory, createContextToken, Context } from '../context';
import * as TE from 'fp-ts/TaskEither';
import * as t from 'io-ts';
import { function as F } from 'fp-ts';
import { CoreError } from '../error';

type InputType = {
  input: number;
};

type OutputType = {
  output: number;
};

describe('UseCase', () => {
  test('io-port', async () => {
    const port = createPort<number>();
    const validatePort = createValidatorPort(fromType(t.number));
    const i = await F.pipe(port(10), TE.toUnion)();
    const validatorI = await F.pipe(validatePort(10), TE.toUnion)();

    const validatorIError = await F.pipe(
      validatePort('asd' as any),
      TE.toUnion
    )();

    expect(i).toBe(10);
    expect(validatorI).toBe(10);
    expect(validatorIError).toBeInstanceOf(CoreError);
  });
  test('createUseCase', () => {
    const usecaseCreator = createUseCase(
      'usecaseName',
      makeIOPort(createPort<InputType>(), createPort<OutputType>())
    );

    const usecase = usecaseCreator({
      input: 10,
    });

    expect(usecase[0]).toHaveProperty('port');
    expect(usecase[0]).toHaveProperty('token');
    expect(usecase[0]).toHaveProperty('_as', 'usecase');
  });
  test('usecaseResolver', (done) => {
    const usecaseCreator = createUseCase(
      'usecaseName',
      makeIOPort(
        createPort<InputType>(),
        createValidatorPort<OutputType>(
          fromType(
            t.type({
              output: t.number,
            })
          )
        )
      )
    );
    const usecaseCreator2 = createUseCase(
      'usecaseName2',
      makeIOPort(createPort<InputType>(), createPort<OutputType>())
    );

    const resolver = createResolver(usecaseCreator, (_ctx, input) => {
      return TE.right({
        output: input.input * 2,
      });
    });

    const resolver2 = createResolver(usecaseCreator2, (ctx, input) => {
      return useResolver(usecaseCreator(input))(ctx) as any;
    });

    const context = from(contextFactory(resolver,resolver2));
    context
      .pipe(
        concatMap((context) => {
          const res1 = useResolver(
            usecaseCreator({
              input: 10,
            })
          )(context);
          const res2 = useResolver(
            usecaseCreator2({
              input: 20,
            })
          )(context);

          return combineLatest([res1(), res2()]);
        })
      )
      .subscribe({
        next: ([val1,val2]) => {
          expect(val1).toHaveProperty('output', 20);
          expect(val2).toHaveProperty('output', 40);
          done();
        },
        error: (e) => {
          done(e);
        },
        // complete: () => done()
      });
  });
});
