import { getCurrentInstance, onUnmounted } from 'vue'
import { throwNoCurrentInstance } from './utils'
import { useRouter } from './globals'
import type { NavigationGuard, Route } from '../util/route'
import type { VNodeDataWithExtras } from '../types/declarations'

/**
 * Add a navigation guard that triggers whenever the current location is about to be updated. Similar to beforeRouteUpdate but can be used in any component. The guard is removed when the component is unmounted.
 *
 * @param updateGuard
 */
export function onBeforeRouteUpdate(updateGuard: NavigationGuard) {
  // @ts-ignore
  if (process.env.NODE_ENV !== 'production') {
    throwNoCurrentInstance('onBeforeRouteUpdate')
  }

  return useFilteredGuard(updateGuard, isUpdateNavigation)
}
function isUpdateNavigation(to: Route, from: Route, depth: number) {
  const toMatched = to.matched
  const fromMatched = from.matched
  return (
    toMatched.length >= depth &&
    toMatched
      .slice(0, depth + 1)
      .every((record, i) => record === fromMatched[i])
  )
}

function isLeaveNavigation(to: Route, from: Route, depth: number) {
  const toMatched = to.matched
  const fromMatched = from.matched
  return toMatched.length < depth || toMatched[depth] !== fromMatched[depth]
}
/**
 * Add a navigation guard that triggers whenever the component for the current location is about to be left. Similar to beforeRouteLeave but can be used in any component. The guard is removed when the component is unmounted.
 *
 * @param leaveGuard
 */
export function onBeforeRouteLeave(leaveGuard: NavigationGuard) {
  // @ts-ignore
  if (process.env.NODE_ENV !== 'production') {
    throwNoCurrentInstance('onBeforeRouteLeave')
  }

  return useFilteredGuard(leaveGuard, isLeaveNavigation)
}

const noop = () => {}
function useFilteredGuard(
  guard: NavigationGuard,
  fn: (to: Route, from: Route, depth: number) => boolean,
) {
  const instance = getCurrentInstance()
  const router = useRouter()

  let target = instance!.proxy
  // find the nearest RouterView to know the depth
  while (
    target &&
    target.$vnode &&
    target.$vnode.data &&
    (target.$vnode.data as VNodeDataWithExtras).routerViewDepth == null
  ) {
    target = target.$parent as any
  }

  const depth =
    target && target.$vnode && target.$vnode.data
      ? (target.$vnode.data as VNodeDataWithExtras).routerViewDepth
      : null

  if (depth != null) {
    const removeGuard = router.beforeEach((to, from, next) => {
      return fn(to, from, depth) ? guard(to, from, next) : next()
    })

    onUnmounted(removeGuard)
    return removeGuard
  }

  return noop
}
