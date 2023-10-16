import type { Dictionary, Maybe } from '../types/declarations'
import type VueRouter from '../router'
import type { RawLocation } from '../util/location'
import { cleanPath } from '../util/path'
import {
  pushState,
  replaceState,
  stripStateKey,
  supportsPushState,
} from '../util/push-state'
import type { Route } from '../util/route'
import { handleScroll, setupScroll } from '../util/scroll'
import { History } from './base'
import { getLocation } from './html5'

export class HashHistory extends History {
  constructor(router: VueRouter, base: Maybe<string>, fallback: boolean) {
    super(router, base)
    // check history fallback deeplinking
    if (fallback && checkFallback(this.base)) {
      return
    }
    ensureSlash()
  }

  // this is delayed until the app mounts
  // to avoid the hashchange listener being fired too early
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
      if (!ensureSlash()) {
        return
      }
      this.transitionTo(
        { path: getHash(), state: stripStateKey(window.history.state) },
        (route) => {
          if (supportsScroll) {
            handleScroll(this.router, route, current, true)
          }
          if (!supportsPushState) {
            replaceHash(route.fullPath)
          }
        },
      )
    }
    const eventType = supportsPushState ? 'popstate' : 'hashchange'
    window.addEventListener(eventType, handleRoutingEvent)
    this.listeners.push(() => {
      window.removeEventListener(eventType, handleRoutingEvent)
    })
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
        pushHash(route.fullPath, route.state)
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
        replaceHash(route.fullPath, route.state)
        handleScroll(this.router, route, fromRoute, false)
        onComplete && onComplete(route)
      },
      onAbort,
    )
  }

  go(n: number) {
    window.history.go(n)
  }

  ensureURL(push?: boolean) {
    const current = this.current.fullPath
    if (getHash() !== current) {
      push ? pushHash(current) : replaceHash(current)
    }
  }

  getCurrentLocation() {
    return getHash()
  }
}

function checkFallback(base: string) {
  const location = getLocation(base)
  if (!/^\/#/.test(location)) {
    window.location.replace(cleanPath(base + '/#' + location))
    return true
  }
}

function ensureSlash(): boolean {
  const path = getHash()
  if (path.charAt(0) === '/') {
    return true
  }
  replaceHash('/' + path)
  return false
}

export function getHash(): string {
  // We can't use window.location.hash here because it's not
  // consistent across browsers - Firefox will pre-decode it!
  let href = window.location.href
  const index = href.indexOf('#')
  // empty path
  if (index < 0) return ''

  href = href.slice(index + 1)

  return href
}

function getUrl(path: string) {
  const href = window.location.href
  const i = href.indexOf('#')
  const base = i >= 0 ? href.slice(0, i) : href
  return `${base}#${path}`
}

function pushHash(path: string, state?: Dictionary<any>) {
  if (supportsPushState) {
    pushState(getUrl(path), false, state)
  } else {
    window.location.hash = path
  }
}

function replaceHash(path: string, state?: Dictionary<any>) {
  if (supportsPushState) {
    replaceState(getUrl(path), state)
  } else {
    window.location.replace(getUrl(path))
  }
}
