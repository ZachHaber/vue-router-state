import { runQueue } from '../../../src/util/async'
import 'jasmine'

describe('Async utils', () => {
  describe('runQueue', () => {
    it('should work', (done) => {
      const calls: number[] = []
      const queue = [1, 2, 3, 4, 5].map((i) => (next: any) => {
        calls.push(i)
        setTimeout(next, 0)
      })
      runQueue(
        queue,
        (fn: any, next) => fn(next),
        () => {
          expect(calls).toEqual([1, 2, 3, 4, 5])
          done()
        },
      )
    })
  })
})
