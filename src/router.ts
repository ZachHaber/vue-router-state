import { createMatcher } from './create-matcher'
import { install } from './install'
import { inBrowser } from './util/dom'
import { isNavigationFailure, NavigationFailureType } from './util/errors'
import { Location, normalizeLocation, RawLocation } from './util/location'
import { cleanPath } from './util/path'
import { stripStateKey, supportsPushState } from './util/push-state'
import { NavigationGuard, Route, RouteConfig, START } from './util/route'
import { handleScroll, Position, PositionResult } from './util/scroll'
import { assert, warn } from './util/warn'

import { AbstractHistory } from './history/abstract'
import { HashHistory } from './history/hash'
import { HTML5History } from './history/html5'

import Vue from 'vue'
import type { Matcher } from './create-matcher'
import {
  AfterNavigationHook,
  Component,
  ErrorHandler,
  Maybe,
  RouterMode,
} from './types/declarations'
import type { Query } from './util/query'

/**
 * Options to initialize a {@link VueRouter} instance.
 */
export interface RouterOptions {
  routes?: RouteConfig[]
  /**
   * Configure the router mode.
   *
   * default: `"hash"` (in browser) | `"abstract"` (in Node.js)
   *
   * available values: `"hash" | "history" | "abstract"`
   * - `"hash"`: uses the URL hash for routing. Works in all Vue-supported browsers, including those that do not support
   *   HTML5 History API.
   * - `"history"`: requires HTML5 History API and server config. See HTML5 History Mode.
   * - `"abstract"`: works in all JavaScript environments, e.g. server-side with Node.js. **The router will
   *   automatically be forced into this mode if no browser API is present.**
   */
  mode?: RouterMode
  fallback?: boolean
  base?: string
  /**
   * Default class applied to active {@link RouterLink}. If none is provided, `router-link-active` will be applied.
   */
  linkActiveClass?: string
  /**
   * Default class applied to active {@link RouterLink}. If none is provided, `router-link-exact-active` will be
   * applied.
   */
  linkExactActiveClass?: string
  /**
   * Custom implementation to parse a query. See its counterpart, {@link stringifyQuery}.
   */
  parseQuery?: (query: string) => Query
  /**
   * Custom implementation to stringify a query object. Should not prepend a leading `?`. {@link parseQuery} counterpart
   * to handle query parsing.
   */
  stringifyQuery?: (query: Query) => string
  /**
   * Function to control scrolling when navigating between pages. Can return a Promise to delay scrolling.
   *
   * For more details see {@link Scroll Behavior}.
   */
  scrollBehavior?: (
    to: Route,
    from: Route,
    savedPosition: Position | void,
  ) => PositionResult | Promise<PositionResult> | undefined | null
}
/**
 * Router instance.
 */
export default class VueRouter {
  /**
   * @internal
   */
  static install = install
  static version = '__VERSION__'
  static isNavigationFailure = isNavigationFailure
  static NavigationFailureType = NavigationFailureType
  /**
   * Initial route location where the router is. Can be used in navigation guards to differentiate the initial navigation.
   */
  static START_LOCATION = START

  app: Vue | null
  apps: Array<Vue>
  ready?: boolean
  readyCbs?: Array<Function>
  /**
   * Original options object passed to create the Router
   */
  options: RouterOptions
  /**
   * Configured mode when creating the Router instance.
   */
  mode: RouterMode
  history: HashHistory | HTML5History | AbstractHistory
  matcher: Matcher
  fallback: boolean
  beforeHooks: Array<Maybe<NavigationGuard>>
  resolveHooks: Array<Maybe<NavigationGuard>>
  afterHooks: Array<Maybe<AfterNavigationHook>>

  constructor(options: RouterOptions = {}) {
    // @ts-ignore
    if (process.env.NODE_ENV !== 'production') {
      warn(
        this instanceof VueRouter,
        `Router must be called with the new operator.`,
      )
    }
    this.app = null
    this.apps = []
    this.options = options
    this.beforeHooks = []
    this.resolveHooks = []
    this.afterHooks = []
    this.matcher = createMatcher(options.routes || [], this)

    let mode = options.mode || 'hash'
    this.fallback =
      mode === 'history' && !supportsPushState && options.fallback !== false
    if (this.fallback) {
      mode = 'hash'
    }
    if (!inBrowser) {
      mode = 'abstract'
    }
    this.mode = mode

    switch (mode) {
      case 'history':
        this.history = new HTML5History(this, options.base)
        break
      case 'hash':
        this.history = new HashHistory(this, options.base, this.fallback)
        break
      case 'abstract':
        this.history = new AbstractHistory(this, options.base)
        break
      default:
        assert(false, `invalid mode: ${mode}`)
    }
  }

  match(raw: RawLocation, current?: Route, redirectedFrom?: Location): Route {
    return this.matcher.match(raw, current, redirectedFrom)
  }

  /**
   * Current {@link Route}
   */
  get currentRoute(): Route {
    return this.history && this.history.current
  }

  init(app: any /* Vue component instance */) {
    // @ts-ignore
    process.env.NODE_ENV !== 'production' &&
      assert(
        (install as any).installed,
        `not installed. Make sure to call \`Vue.use(VueRouter)\` ` +
          `before creating root instance.`,
      )

    this.apps.push(app)

    // set up app destroyed handler
    // https://github.com/vuejs/vue-router/issues/2639
    app.$once('hook:destroyed', () => {
      // clean out app from this.apps array once destroyed
      const index = this.apps.indexOf(app)
      if (index > -1) this.apps.splice(index, 1)
      // ensure we still have a main app or null if no apps
      // we do not release the router so it can be reused
      if (this.app === app) this.app = this.apps[0] || null

      if (!this.app) this.history.teardown()
    })

    // main app previously initialized
    // return as we don't need to set up new history listener
    if (this.app) {
      return
    }

    this.app = app

    const history = this.history

    if (history instanceof HTML5History || history instanceof HashHistory) {
      const handleInitialScroll = (routeOrError: Route | Error) => {
        const from = history.current
        const expectScroll = this.options.scrollBehavior
        const supportsScroll = supportsPushState && expectScroll

        if (supportsScroll && 'fullPath' in routeOrError) {
          handleScroll(this, routeOrError, from, false)
        }
      }
      const setupListeners = (routeOrError: Route | Error) => {
        history.setupListeners()
        handleInitialScroll(routeOrError)
      }
      history.transitionTo(
        {
          path: history.getCurrentLocation(),
          state: stripStateKey(window.history.state),
        },
        setupListeners,
        setupListeners,
      )
    }

    history.listen((route) => {
      this.apps.forEach((app) => {
        ;(app as unknown as { _route: Route })._route = route
      })
    })
  }
  /**
   * Add a navigation guard that executes before any navigation.
   *
   * @param guard - navigation guard to add
   * @returns a function that removes the registered guard
   *
   * @example
   * ```js
   * router.beforeEach((to, from, next) => {
   *   // must call `next`
   * })
   * ```
   */
  beforeEach(fn: NavigationGuard): () => void {
    return registerHook(this.beforeHooks, fn)
  }
  /**
   * Add a navigation guard that executes before navigation is about to be resolved. At this state all component have
   * been fetched and other navigation guards have been successful.
   *
   * @param guard - navigation guard to add
   * @returns a function that removes the registered guard
   *
   * @example
   * ```js
   * router.beforeResolve((to, from, next) => {
   *   // must call `next`
   * })
   * ```
   */
  beforeResolve(fn: NavigationGuard): () => void {
    return registerHook(this.resolveHooks, fn)
  }
  /**
   * Add a navigation hook that is executed after every navigation. Returns a function that removes the registered hook.
   *
   * @param hook - navigation hook to add
   * @returns a function that removes the registered guard
   *
   * @example
   * ```js
   * router.afterEach((to, from) => {
   *   console.log('after navigation')
   * })
   * ```
   */
  afterEach(fn: NavigationGuard): () => void {
    return registerHook(this.afterHooks, fn)
  }

  /**
   * This method queues a callback to be called when the router has completed the initial navigation, which means it has
   * resolved all async enter hooks and async components that are associated with the initial route.
   *
   * This is useful in server-side rendering to ensure consistent output on both the server and the client.
   * @param cb onReady callback.
   * @param errorCb errorCb will be called when the initial route resolution runs into an error (e.g. failed to resolve
   * an async component).
   */
  onReady(cb: () => void, errorCb?: ErrorHandler) {
    this.history.onReady(cb, errorCb)
  }
  /**
   * Adds an error handler that is called every time a non caught error happens during navigation. This includes errors
   * thrown synchronously and asynchronously, errors returned or passed to `next` in any navigation guard, and errors
   * occurred when trying to resolve an async component that is required to render a route.
   *
   * @param handler - error handler to register
   */
  onError(errorCb: ErrorHandler) {
    this.history.onError(errorCb)
  }
  /**
   * Programmatically navigate to a new URL by pushing an entry in the history stack.
   *
   * @param to Route location to navigate to
   */
  push(to: RawLocation): Promise<Route>
  /**
   * Programmatically navigate to a new URL by pushing an entry in the history stack.
   *
   * @param to Route location to navigate to
   * @param onComplete Navigation success callback
   * @param onAbort Navigation aborted callback
   */
  push(
    to: RawLocation,
    onComplete: (route: Route) => void,
    onAbort?: ErrorHandler,
  ): void
  push(
    location: RawLocation,
    onComplete?: (route: Route) => void,
    onAbort?: (err: Error) => void,
  ) {
    if (!onComplete && !onAbort && typeof Promise !== 'undefined') {
      return new Promise((resolve, reject) => {
        this.history.push(location, resolve, reject)
      })
    } else {
      this.history.push(location, onComplete, onAbort)
    }
  }
  /**
   * Programmatically navigate to a new URL by replacing the current entry in the history stack.
   *
   * @param to Route location to navigate to
   */
  replace(to: RawLocation): Promise<Route>
  /**
   * Programmatically navigate to a new URL by replacing the current entry in the history stack.
   *
   * @param to Route location to navigate to
   * @param onComplete Navigation success callback
   * @param onAbort Navigation aborted callback
   */
  replace(
    to: RawLocation,
    onComplete: (route: Route) => void,
    onAbort?: ErrorHandler,
  ): void
  replace(
    location: RawLocation,
    onComplete?: (route: Route) => void,
    onAbort?: ErrorHandler,
  ) {
    if (!onComplete && !onAbort && typeof Promise !== 'undefined') {
      return new Promise((resolve, reject) => {
        this.history.replace(location, resolve, reject)
      })
    } else {
      this.history.replace(location, onComplete, onAbort)
    }
  }
  /**
   * Allows you to move forward or backward through the history. Calls `history.go()`.
   *
   * @param delta The position in the history to which you want to move, relative to the current page
   */
  go(n: number) {
    this.history.go(n)
  }
  /**
   * Go back in history if possible by calling `history.back()`. Equivalent to `router.go(-1)`.
   */
  back() {
    this.go(-1)
  }
  /**
   * Go forward in history if possible by calling `history.forward()`. Equivalent to `router.go(1)`.
   */
  forward() {
    this.go(1)
  }

  getMatchedComponents(to?: RawLocation | Route): Array<Component> {
    const route = to
      ? typeof to !== 'string' && 'matched' in to
        ? to
        : this.resolve(to).route
      : this.currentRoute
    if (!route) {
      return []
    }
    return ([] as Component[]).concat.apply(
      [] as Component[],
      route.matched.map((m) => {
        return Object.keys(m.components).map((key) => {
          return m.components[key]
        })
      }),
    )
  }
  /**
   *
   * @param to Route location
   * @param current current is the current Route by default (most of the time you don't need to change this)
   * @param append allows you to append the path to the `current` route (as with `router-link`)
   */
  resolve(
    to: RawLocation,
    current?: Route,
    append?: boolean,
  ): {
    location: Location
    route: Route
    href: string
    // for backwards compat
    normalizedTo: Location
    resolved: Route
  } {
    current = current || this.history.current
    const location = normalizeLocation(to, current, append, this)
    const route = this.match(location, current)
    const fullPath = route.redirectedFrom || route.fullPath
    const base = this.history.base
    const href = createHref(base, fullPath, this.mode)
    return {
      location,
      route,
      href,
      // for backwards compat
      normalizedTo: location,
      resolved: route,
    }
  }
  /**
   * Get the list of all the active route records.
   */
  getRoutes() {
    return this.matcher.getRoutes()
  }
  /**
   * Add a new {@link RouteConfig | route record} as the child of an existing route. If the route has a `name` and there
   * is already an existing one with the same one, it overwrites it.
   *
   * @param parentName - Parent Route Record where `route` should be appended at
   * @param route - Route Record to add
   */
  addRoute(parentName: string, route: RouteConfig): void
  /**
   * Add a new {@link RouteConfig | route} to the router. If the route has a `name` and there is already an existing one
   * with the same one, it overwrites it.
   * @param route - Route Record to add
   */
  addRoute(route: RouteConfig): void
  addRoute(parentOrRoute: string | RouteConfig, route?: RouteConfig) {
    this.matcher.addRoute(parentOrRoute, route)
    if (this.history.current !== START) {
      this.history.transitionTo(this.history.getCurrentLocation())
    }
  }
  /**
   * @deprecated use {@link addRoute | router.addRoute()} instead
   */
  addRoutes(routes: Array<RouteConfig>) {
    // @ts-ignore
    if (process.env.NODE_ENV !== 'production') {
      warn(
        false,
        'router.addRoutes() is deprecated and has been removed in Vue Router 4. Use router.addRoute() instead.',
      )
    }
    this.matcher.addRoutes(routes)
    if (this.history.current !== START) {
      this.history.transitionTo(this.history.getCurrentLocation())
    }
  }
}

function registerHook(
  list: Array<Maybe<NavigationGuard>>,
  fn: NavigationGuard,
): () => void {
  list.push(fn)
  return () => {
    const i = list.indexOf(fn)
    if (i > -1) list.splice(i, 1)
  }
}

function createHref(base: string, fullPath: string, mode: RouterMode) {
  var path = mode === 'hash' ? '#' + fullPath : fullPath
  return base ? cleanPath(base + '/' + path) : path
}

if (inBrowser && window.Vue) {
  window.Vue.use(VueRouter)
}
