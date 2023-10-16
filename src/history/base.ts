import type Vue from 'vue'
import type { VueConstructor } from 'vue'
import { _Vue } from '../install'
import type VueRouter from '../router'
import type { Maybe } from '../types/declarations'
import { runQueue } from '../util/async'
import { inBrowser } from '../util/dom'
import {
  createNavigationAbortedError,
  createNavigationCancelledError,
  createNavigationDuplicatedError,
  createNavigationRedirectedError,
  isError,
  isNavigationFailure,
  NavigationFailureType,
} from '../util/errors'
import type { RawLocation } from '../util/location'
import {
  flatMapComponents,
  flatten,
  resolveAsyncComponents,
} from '../util/resolve-components'
import {
  handleRouteEntered,
  isSameRoute,
  NavigationGuard,
  NavigationGuardNext,
  Route,
  RouteRecord,
  START,
} from '../util/route'
import { handleScroll } from '../util/scroll'
import { warn } from '../util/warn'

export abstract class History {
  router: VueRouter
  base: string
  current: Route
  pending: Maybe<Route>
  cb?: (r: Route) => void
  ready: boolean
  readyCbs: Array<Function>
  readyErrorCbs: Array<Function>
  errorCbs: Array<Function>
  listeners: Array<Function>
  // cleanupListeners: Function

  // implemented by sub-classes
  abstract go(n: number): void
  abstract push(
    loc: RawLocation,
    onComplete?: (route: Route) => void,
    onAbort?: Function,
  ): void
  abstract replace(
    loc: RawLocation,
    onComplete?: (route: Route) => void,
    onAbort?: Function,
  ): void
  abstract ensureURL(push?: boolean): void
  abstract getCurrentLocation(): string

  constructor(router: VueRouter, base: Maybe<string>) {
    this.router = router
    this.base = normalizeBase(base)
    // start with a route object that stands for "nowhere"
    this.current = START
    this.pending = null
    this.ready = false
    this.readyCbs = []
    this.readyErrorCbs = []
    this.errorCbs = []
    this.listeners = []
  }

  listen(cb: (r: Route) => void) {
    this.cb = cb
  }

  onReady(cb: Function, errorCb: Maybe<Function>) {
    if (this.ready) {
      cb()
    } else {
      this.readyCbs.push(cb)
      if (errorCb) {
        this.readyErrorCbs.push(errorCb)
      }
    }
  }

  onError(errorCb: Function) {
    this.errorCbs.push(errorCb)
  }

  transitionTo(
    location: RawLocation,
    onComplete?: (route: Route) => void,
    onAbort?: Function,
  ) {
    let route: Route
    // catch redirect option https://github.com/vuejs/vue-router/issues/3201
    try {
      route = this.router.match(location, this.current)
    } catch (e) {
      this.errorCbs.forEach((cb) => {
        cb(e)
      })
      // Exception should still be thrown
      throw e
    }
    const prev = this.current
    this.confirmTransition(
      route,
      () => {
        this.updateRoute(route)
        onComplete && onComplete(route)
        this.ensureURL()
        this.router.afterHooks.forEach((hook) => {
          hook && hook(route, prev)
        })

        // fire ready cbs once
        if (!this.ready) {
          this.ready = true
          this.readyCbs.forEach((cb) => {
            cb(route)
          })
        }
      },
      (err) => {
        if (onAbort) {
          onAbort(err)
        }
        if (err && !this.ready) {
          // Initial redirection should not mark the history as ready yet
          // because it's triggered by the redirection instead
          // https://github.com/vuejs/vue-router/issues/3225
          // https://github.com/vuejs/vue-router/issues/3331
          if (
            !isNavigationFailure(err, NavigationFailureType.redirected) ||
            prev !== START
          ) {
            this.ready = true
            this.readyErrorCbs.forEach((cb) => {
              cb(err)
            })
          }
        }
      },
    )
  }

  confirmTransition(
    route: Route,
    onComplete: Function,
    onAbort?: (err: unknown) => void,
  ) {
    const current = this.current
    this.pending = route
    const abort = (err: unknown) => {
      // changed after adding errors with
      // https://github.com/vuejs/vue-router/pull/3047 before that change,
      // redirect and aborted navigation would produce an err == null
      if (!isNavigationFailure(err) && isError(err)) {
        if (this.errorCbs.length) {
          this.errorCbs.forEach((cb) => {
            cb(err)
          })
        } else {
          // @ts-ignore
          if (process.env.NODE_ENV !== 'production') {
            warn(false, 'uncaught error during route navigation:')
          }
          console.error(err)
        }
      }
      onAbort && onAbort(err)
    }
    const lastRouteIndex = route.matched.length - 1
    const lastCurrentIndex = current.matched.length - 1
    if (
      isSameRoute(route, current) &&
      // in the case the route map has been dynamically appended to
      lastRouteIndex === lastCurrentIndex &&
      route.matched[lastRouteIndex] === current.matched[lastCurrentIndex]
    ) {
      this.ensureURL()
      if (route.hash) {
        handleScroll(this.router, current, route, false)
      }
      return abort(createNavigationDuplicatedError(current, route))
    }

    const { updated, deactivated, activated } = resolveQueue(
      this.current.matched,
      route.matched,
    )

    const queue: Array<Maybe<NavigationGuard>> = (
      [] as Maybe<NavigationGuard>[]
    ).concat(
      // in-component leave guards
      extractLeaveGuards(deactivated),
      // global before hooks
      this.router.beforeHooks,
      // in-component update hooks
      extractUpdateHooks(updated),
      // in-config enter guards
      activated.map((m) => m.beforeEnter),
      // async components
      resolveAsyncComponents(activated),
    )

    const iterator = (hook: NavigationGuard, next: (to?: Route) => void) => {
      if (this.pending !== route) {
        return abort(createNavigationCancelledError(current, route))
      }
      try {
        hook(route, current, (to: any) => {
          if (to === false) {
            // next(false) -> abort navigation, ensure current URL
            this.ensureURL(true)
            abort(createNavigationAbortedError(current, route))
          } else if (isError(to)) {
            this.ensureURL(true)
            abort(to)
          } else if (
            typeof to === 'string' ||
            (typeof to === 'object' &&
              (typeof to.path === 'string' || typeof to.name === 'string'))
          ) {
            // next('/') or next({ path: '/' }) -> redirect
            abort(createNavigationRedirectedError(current, route))
            if (typeof to === 'object' && to.replace) {
              this.replace(to)
            } else {
              this.push(to)
            }
          } else {
            // confirm transition and pass on the value
            next(to)
          }
        })
      } catch (e) {
        abort(e)
      }
    }

    runQueue(queue, iterator, () => {
      // wait until async components are resolved before
      // extracting in-component enter guards
      const enterGuards = extractEnterGuards(activated)
      const queue = enterGuards.concat(this.router.resolveHooks)
      runQueue(queue, iterator, () => {
        if (this.pending !== route) {
          return abort(createNavigationCancelledError(current, route))
        }
        this.pending = null
        onComplete(route)
        if (this.router.app) {
          this.router.app.$nextTick(() => {
            handleRouteEntered(route)
          })
        }
      })
    })
  }

  updateRoute(route: Route) {
    this.current = route
    this.cb && this.cb(route)
  }

  setupListeners() {
    // Default implementation is empty
  }

  teardown() {
    // clean up event listeners
    // https://github.com/vuejs/vue-router/issues/2341
    this.listeners.forEach((cleanupListener) => {
      cleanupListener()
    })
    this.listeners = []

    // reset current history route
    // https://github.com/vuejs/vue-router/issues/3294
    this.current = START
    this.pending = null
  }
}

function normalizeBase(base: Maybe<string>): string {
  if (!base) {
    if (inBrowser) {
      // respect <base> tag
      const baseEl = document.querySelector('base')
      base = (baseEl && baseEl.getAttribute('href')) || '/'
      // strip full URL origin
      base = base.replace(/^https?:\/\/[^\/]+/, '')
    } else {
      base = '/'
    }
  }
  // make sure there's the starting slash
  if (base.charAt(0) !== '/') {
    base = '/' + base
  }
  // remove trailing slash
  return base.replace(/\/$/, '')
}

function resolveQueue(
  current: Array<RouteRecord>,
  next: Array<RouteRecord>,
): {
  updated: Array<RouteRecord>
  activated: Array<RouteRecord>
  deactivated: Array<RouteRecord>
} {
  let i
  const max = Math.max(current.length, next.length)
  for (i = 0; i < max; i++) {
    if (current[i] !== next[i]) {
      break
    }
  }
  return {
    updated: next.slice(0, i),
    activated: next.slice(i),
    deactivated: current.slice(i),
  }
}

function extractGuards(
  records: Array<RouteRecord>,
  name: string,
  bind: (
    guard: NavigationGuard,
    instance: Vue,
    match: RouteRecord,
    key: string,
  ) => void,
  reverse?: boolean,
): Array<Maybe<NavigationGuard>> {
  const guards = flatMapComponents(records, (def, instance, match, key) => {
    const guard = extractGuard(def, name)
    if (guard) {
      return Array.isArray(guard)
        ? guard.map((guard) => bind(guard, instance, match, key))
        : bind(guard, instance, match, key)
    }
  })
  return flatten(reverse ? guards.reverse() : guards)
}

function extractGuard(
  def: Object | Function,
  key: string,
): NavigationGuard | Array<NavigationGuard> {
  if (typeof def !== 'function') {
    // extend now so that global mixins are applied.
    def = (_Vue as typeof _Vue & VueConstructor).extend(def)
  }
  return (def as any).options[key]
}

function extractLeaveGuards(
  deactivated: Array<RouteRecord>,
): Array<Maybe<NavigationGuard>> {
  return extractGuards(deactivated, 'beforeRouteLeave', bindGuard, true)
}

function extractUpdateHooks(
  updated: Array<RouteRecord>,
): Array<Maybe<NavigationGuard>> {
  return extractGuards(updated, 'beforeRouteUpdate', bindGuard)
}

function bindGuard(
  guard: NavigationGuard,
  instance: Maybe<Vue>,
): Maybe<NavigationGuard> {
  if (instance) {
    return function boundRouteGuard() {
      return guard.apply(
        instance,
        arguments as unknown as Parameters<typeof guard>,
      )
    }
  }
}

function extractEnterGuards(
  activated: Array<RouteRecord>,
): Array<Maybe<NavigationGuard>> {
  return extractGuards(
    activated,
    'beforeRouteEnter',
    (guard, _, match, key) => {
      return bindEnterGuard(guard, match, key)
    },
  )
}

function bindEnterGuard(
  guard: NavigationGuard,
  match: RouteRecord,
  key: string,
): NavigationGuard {
  return function routeEnterGuard(to, from, next) {
    return guard(to, from, (cb) => {
      if (typeof cb === 'function') {
        if (!match.enteredCbs[key]) {
          match.enteredCbs[key] = []
        }
        match.enteredCbs[key].push(cb as NavigationGuardNext)
      }
      next(cb)
    })
  }
}
