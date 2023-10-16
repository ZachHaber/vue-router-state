import type Vue from 'vue'
import VueRouter from '../router'
import type {
  Component,
  Dictionary,
  Maybe,
  RouteMeta,
  RouteRegExp,
} from '../types/declarations'
import { Location, RawLocation } from './location'
import { Query, stringifyQuery } from './query'

const trailingSlashRE = /\/?$/

export type NavigationGuardNext<V extends Vue = Vue> = (
  to?: RawLocation | false | ((vm: V) => any) | void,
) => void

export type NavigationGuard<V extends Vue = Vue> = (
  to: Route,
  from: Route,
  next: NavigationGuardNext<V>,
) => any

export interface PathToRegexpOptions {
  sensitive?: boolean
  strict?: boolean
  end?: boolean
}

export type RedirectOption = RawLocation | ((to: Route) => RawLocation)
export type RoutePropsFunction = (route: Route) => Object
interface _RouteConfigBase {
  path: string
  name?: string
  children?: RouteConfig[]
  redirect?: RedirectOption
  alias?: string | string[]
  meta?: RouteMeta
  beforeEnter?: NavigationGuard
  caseSensitive?: boolean
  pathToRegexpOptions?: PathToRegexpOptions
}

export interface RouteConfigSingleView extends _RouteConfigBase {
  component?: Component
  props?: boolean | Object | RoutePropsFunction
}

export interface RouteConfigMultipleViews extends _RouteConfigBase {
  components?: Dictionary<Component>
  props?: Dictionary<boolean | Object | RoutePropsFunction>
}

export type RouteConfig = RouteConfigSingleView | RouteConfigMultipleViews

export interface RouteRecordPublic {
  path: string
  components: Dictionary<Component>
  instances: Dictionary<Vue>
  name?: string
  redirect?: RedirectOption
  meta: any
  beforeEnter?: (
    route: Route,
    redirect: (location: RawLocation) => void,
    next: () => void,
  ) => any
  props:
    | boolean
    | RoutePropsFunction
    | Dictionary<boolean | Object | RoutePropsFunction>
}
export interface RouteRecord {
  path: string
  regex: RouteRegExp
  components: Dictionary<Component>
  alias: string[]
  instances: Dictionary<Vue>
  name?: string
  parent?: RouteRecord
  redirect?: RedirectOption
  matchAs?: string
  meta: RouteMeta
  enteredCbs: Record<string, NavigationGuardNext[]>
  beforeEnter?: Maybe<NavigationGuard>
  props: // | boolean
  // | RoutePropsFunction
  Dictionary<boolean | Object | RoutePropsFunction>
}

export interface Route<State = Dictionary<any>> {
  path: string
  name?: string | null
  hash: string
  query: Dictionary<string | null | (string | null)[]>
  params: Dictionary<string>
  state?: State
  fullPath: string
  matched: RouteRecord[]
  redirectedFrom?: string
  meta?: RouteMeta
}
export function createRoute(
  record: Maybe<RouteRecord>,
  location: Location,
  redirectedFrom?: Maybe<Location>,
  router?: VueRouter,
): Route {
  const stringifyQuery = router && router.options.stringifyQuery

  let query: any = location.query || {}
  try {
    query = clone(query)
  } catch (e) {}

  const route: Route = {
    name: location.name || (record && record.name),
    meta: (record && record.meta) || {},
    path: location.path || '/',
    hash: location.hash || '',
    query,
    params: location.params || {},
    state: location.state || {},
    fullPath: getFullPath(location, stringifyQuery),
    matched: record ? formatMatch(record) : [],
  }
  if (redirectedFrom) {
    route.redirectedFrom = getFullPath(redirectedFrom, stringifyQuery)
  }
  return Object.freeze(route)
}

function clone<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map(clone) as T
  } else if (value && typeof value === 'object') {
    const res: T = {} as T
    for (const key in value) {
      res[key] = clone(value[key])
    }
    return res
  } else {
    return value
  }
}

/**
 * Initial route location where the router is. Can be used in navigation guards to differentiate the initial navigation.
 */
export const START = createRoute(null, {
  path: '/',
})

function formatMatch(record: Maybe<RouteRecord>): Array<RouteRecord> {
  const res = []
  while (record) {
    res.unshift(record)
    record = record.parent
  }
  return res
}

function getFullPath(
  { path, query = {}, hash = '' }: Location,
  stringify = stringifyQuery,
): string {
  return (path || '/') + stringify(query) + hash
}

export function isSameRoute(
  a: Route,
  b: Maybe<Route>,
  onlyPath?: Maybe<boolean>,
): boolean {
  if (b === START) {
    return a === b
  } else if (!b) {
    return false
  } else if (a.path && b.path) {
    return (
      a.path.replace(trailingSlashRE, '') ===
        b.path.replace(trailingSlashRE, '') &&
      (onlyPath ||
        (a.hash === b.hash &&
          isObjectEqual(a.query, b.query) &&
          isObjectEqual(a.state, b.state)))
    )
  } else if (a.name && b.name) {
    return (
      a.name === b.name &&
      (onlyPath ||
        (a.hash === b.hash &&
          isObjectEqual(a.query, b.query) &&
          isObjectEqual(a.params, b.params) &&
          isObjectEqual(a.state, b.state)))
    )
  } else {
    return false
  }
}

function isObjectEqual(
  a: Record<string, unknown> = {},
  b: Record<string, unknown> = {},
): boolean {
  // handle null value #1566
  if (!a || !b) return a === b
  const aKeys = Object.keys(a).sort()
  const bKeys = Object.keys(b).sort()
  if (aKeys.length !== bKeys.length) {
    return false
  }
  return aKeys.every((key, i) => {
    const aVal = a[key]
    const bKey = bKeys[i]
    if (bKey !== key) return false
    const bVal = b[key]
    // query values can be null and undefined
    if (aVal == null || bVal == null) return aVal === bVal
    // check nested equality
    if (typeof aVal === 'object' && typeof bVal === 'object') {
      return isObjectEqual(
        aVal as Record<string, unknown>,
        bVal as Record<string, unknown>,
      )
    }
    return String(aVal) === String(bVal)
  })
}

export function isIncludedRoute(current: Route, target: Route): boolean {
  return (
    current.path
      .replace(trailingSlashRE, '/')
      .indexOf(target.path.replace(trailingSlashRE, '/')) === 0 &&
    (!target.hash || current.hash === target.hash) &&
    queryIncludes(current.query, target.query)
  )
}

function queryIncludes(current: Query, target: Query): boolean {
  for (const key in target) {
    if (!(key in current)) {
      return false
    }
  }
  return true
}

export function handleRouteEntered(route: Route) {
  for (let i = 0; i < route.matched.length; i++) {
    const record = route.matched[i]
    for (const name in record.instances) {
      const instance = record.instances[name]
      const cbs = record.enteredCbs[name]
      if (!instance || !cbs) continue
      delete record.enteredCbs[name]
      for (let i = 0; i < cbs.length; i++) {
        if (!(instance as any)._isBeingDestroyed) cbs[i](instance as any)
      }
    }
  }
}
