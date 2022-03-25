import { fromType, fromZod } from './validator';
// import { Email } from '../types/Email'
import { z } from 'zod';
import * as F from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';
describe('validator', () => {
  test('fromZod', async () => {
    const s = {
      name: '',
      pass: 'pass'
    };
    const o = z.object({
      name: z.string(),
      pass: z.string().nonempty()
    }).transform((v) => ({
      name: v.name as string,
      pass: v.pass as string
    }))



    // const emailString = 'email@email.com'
    const res = await F.pipe(fromZod(o).validate(s), TE.toUnion)();
    console.log(res);
    expect(res).toBe(s);
  });
});
