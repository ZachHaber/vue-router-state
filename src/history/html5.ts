import type { Maybe } from '../types/declarations'
import type VueRouter from '../router'
import { RawLocation } from '../util/location'
import { cleanPath } from '../util/path'
import {
  pushState,
  replaceState,
  stripStateKey,
  supportsPushState,
} from '../util/push-state'
import { Route, START } from '../util/route'
import { handleScroll, setupScroll } from '../util/scroll'
import { History } from './base'

export class HTML5History extends History {
  _startLocation: string

  constructor(router: VueRouter, base: Maybe<string>) {
    super(router, base)

    this._startLocation = getLocation(this.base)
  }

  setupListeners() {
    if (this.listeners.length > 0) {
      return
    }

    const router = this.router
    const expectScroll = router.options.scrollBehavior
    const supportsScroll = supportsPushState && expectScroll

    if (supportsScroll) {
      this.listeners.push(setupScroll())
    }

    const handleRoutingEvent = () => {
      const current = this.current

      // Avoiding first `popstate` event dispatched in some browsers but first
      // history route not updated since async guard at the same time.
      const location = getLocation(this.base)
      if (this.current === START && location === this._startLocation) {
        return
      }

      this.transitionTo(
        { path: location, state: stripStateKey(window.history.state) },
        (route) => {
          if (supportsScroll) {
            handleScroll(router, route, current, true)
          }
        },
      )
    }
    window.addEventListener('popstate', handleRoutingEvent)
    this.listeners.push(() => {
      window.removeEventListener('popstate', handleRoutingEvent)
    })
  }

  go(n: number) {
    window.history.go(n)
  }

  push(
    location: RawLocation,
    onComplete?: (route: Route) => void,
    onAbort?: Function,
  ) {
    const { current: fromRoute } = this
    this.transitionTo(
      location,
      (route) => {
        pushState(cleanPath(this.base + route.fullPath), false, route.state)
        handleScroll(this.router, route, fromRoute, false)
        onComplete && onComplete(route)
      },
      onAbort,
    )
  }

  replace(
    location: RawLocation,
    onComplete?: (route: Route) => void,
    onAbort?: Function,
  ) {
    const { current: fromRoute } = this
    this.transitionTo(
      location,
      (route) => {
        replaceState(cleanPath(this.base + route.fullPath), route.state)
        handleScroll(this.router, route, fromRoute, false)
        onComplete && onComplete(route)
      },
      onAbort,
    )
  }

  ensureURL(push?: boolean) {
    if (getLocation(this.base) !== this.current.fullPath) {
      const current = cleanPath(this.base + this.current.fullPath)
      push
        ? pushState(current, false, this.current.state)
        : replaceState(current, this.current.state)
    }
  }

  getCurrentLocation(): string {
    return getLocation(this.base)
  }
}

export function getLocation(base: string): string {
  let path = window.location.pathname
  const pathLowerCase = path.toLowerCase()
  const baseLowerCase = base.toLowerCase()
  // base="/a" shouldn't turn path="/app" into "/a/pp"
  // https://github.com/vuejs/vue-router/issues/3555
  // so we ensure the trailing slash in the base
  if (
    base &&
    (pathLowerCase === baseLowerCase ||
      pathLowerCase.indexOf(cleanPath(baseLowerCase + '/')) === 0)
  ) {
    path = path.slice(base.length)
  }
  return (path || '/') + window.location.search + window.location.hash
}
