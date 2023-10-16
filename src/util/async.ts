import type { Maybe } from '../types/declarations'
import { NavigationGuard } from './route'

export function runQueue(
  queue: Array<Maybe<NavigationGuard>>,
  iterator: (guard: NavigationGuard, next: () => void) => void,
  onComplete: () => void,
) {
  const step = (index: number) => {
    if (index >= queue.length) {
      onComplete()
    } else {
      if (queue[index]) {
        iterator(queue[index]!, () => {
          step(index + 1)
        })
      } else {
        step(index + 1)
      }
    }
  }
  step(0)
}
