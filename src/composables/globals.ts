import {
  getCurrentInstance,
  shallowReactive,
  effectScope,
  computed,
  ShallowReactive,
} from 'vue'
import type { Route } from '../util/route'
import { throwNoCurrentInstance } from './utils'

export function useRouter() {
  // @ts-ignore
  if (process.env.NODE_ENV !== 'production') {
    throwNoCurrentInstance('useRouter')
  }

  return getCurrentInstance()!.proxy.$root.$router
}

export function useRoute() {
  // @ts-ignore
  if (process.env.NODE_ENV !== 'production') {
    throwNoCurrentInstance('useRoute')
  }

  const root = getCurrentInstance()!.proxy.$root
  const thisRoot = root as typeof root & {
    _$route: ShallowReactive<Route>
  }
  if (!thisRoot._$route) {
    const route = effectScope(true).run(() =>
      shallowReactive(Object.assign({}, thisRoot.$router.currentRoute)),
    )!
    thisRoot._$route = route

    thisRoot.$router.afterEach((to) => {
      Object.assign(route, to)
    })
  }

  return thisRoot._$route
}

export function useRouteState() {
  const route = useRoute()
  return computed(() => route.state)
}
