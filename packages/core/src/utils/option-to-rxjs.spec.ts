// import {optionToRxjs} from './option-to-rxjs'
// import {
//   option,
// } from 'fp-ts'
// import { CoreError, CoreErrorTag } from '../error'
// describe('option-to-rxjs', () => {
//   test('optionsToRxjs success', (done) => {
//     optionToRxjs()(option.of(10)).subscribe(
//       {
//         next: (v) => {
//           expect(v).toBe(10);
//           done()
//         }
//       }
//     );
//   })
//   test('optionToRxjs fail', (done) => {
//     optionToRxjs()(option.none).subscribe(
//       {
//         error: (err) => {
//           expect(err).toBeInstanceOf(Error);
//           done()
//         }
//       }
//     )
//   })
// })
