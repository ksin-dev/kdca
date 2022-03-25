import { Email } from './Email';
import { validator } from 'io-ts-validator';
import * as F from 'fp-ts/function';
import { either as E } from 'fp-ts';
describe('email', () => {
  test('is not email', () => {
    expect(
      F.pipe(
        'email.com',
        validator(Email).decodeEither,
        E.fold(
          () => false,
          () => true
        )
      )
    ).toBe(false);
  });

  test('is email', () => {
    expect(
      F.pipe(
        'kim@naver.com',
        validator(Email).decodeEither,
        E.fold(
          () => false,
          () => true
        )
      )
    ).toBe(true);
  });
});
