import * as t from 'io-ts';

const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;

export interface EmailBrand {
  readonly Email: unique symbol;
}

export const EmailBrandC = t.brand(
  {
    ...t.string,
    encode: (s) => s.toLowerCase(),
  } as t.StringC,
  (s): s is t.Branded<string, EmailBrand> => regex.test(s),
  'Email'
);

export type EmailType = t.TypeOf<typeof EmailBrandC>;
export type Email = t.OutputOf<typeof EmailBrandC>;
