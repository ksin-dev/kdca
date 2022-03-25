import { eitherToRxjs, taskEitherToRxjs } from './either-to-rxjs';
import { either, taskEither } from 'fp-ts';
import { CoreError } from '../error';
describe('either-to-rxjs', () => {
  test('eitherToRxjs success', (done) => {
    eitherToRxjs(either.of(10)).subscribe({
      next: (v) => {
        expect(v).toBe(10);
        done();
      },
    });
  });
  test('eitherToRxjs fail', (done) => {
    eitherToRxjs(either.left(new Error('err'))).subscribe({
      error: (err) => {
        expect(err).toBeInstanceOf(Error);
        done();
      },
    });
  });

  test('taskEitherToRxjs success', (done) => {
    taskEitherToRxjs(taskEither.right(10)).subscribe({
      next: (v) => {
        expect(v).toBe(10);
        done();
      },
    });
  });

  test('taskEitherToRxjs fail', (done) => {
    taskEitherToRxjs(taskEither.left(new Error('err'))).subscribe({
      error: (err) => {
        expect(err).toBeInstanceOf(Error);
        done();
      },
    });
  });
});
