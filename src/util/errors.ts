import type { Route } from './route'

/**
 * Enumeration with all possible types for navigation failures.
 *
 * Can be passed to {@link isNavigationFailure} to check for specific failures.
 */
export enum NavigationFailureType {
  /**
   * @internal
   */
  redirected = 2,
  /**
   * An aborted navigation is a navigation that failed because a navigation guard returned `false` or called
   * `next(false)`
   */
  aborted = 4,
  /**
   * A cancelled navigation is a navigation that failed because a more recent navigation finished started (not
   * necessarily finished).
   */
  cancelled = 8,
  /**
   * A duplicated navigation is a navigation that failed because it was initiated while already being at the exact same
   * location.
   */
  duplicated = 16,
}

/**
 * Extended Error that contains extra information regarding a failed navigation.
 */
export interface NavigationFailure extends Error {
  /**
   * @internal
   */
  _isRouter: true
  /**
   * Route location we were navigating from
   */
  from: Route
  /**
   * Route location we were navigating to
   */
  to: Route
  /**
   * Type of the navigation. One of {@link NavigationFailureType}
   */
  type: NavigationFailureType
}

export function createNavigationRedirectedError(from: Route, to: Route) {
  return createRouterError(
    from,
    to,
    NavigationFailureType.redirected,
    `Redirected when going from "${from.fullPath}" to "${stringifyRoute(
      to,
    )}" via a navigation guard.`,
  )
}

export function createNavigationDuplicatedError(from: Route, to: Route) {
  const error = createRouterError(
    from,
    to,
    NavigationFailureType.duplicated,
    `Avoided redundant navigation to current location: "${from.fullPath}".`,
  )
  // backwards compatible with the first introduction of Errors
  error.name = 'NavigationDuplicated'
  return error
}

export function createNavigationCancelledError(from: Route, to: Route) {
  return createRouterError(
    from,
    to,
    NavigationFailureType.cancelled,
    `Navigation cancelled from "${from.fullPath}" to "${to.fullPath}" with a new navigation.`,
  )
}

export function createNavigationAbortedError(from: Route, to: Route) {
  return createRouterError(
    from,
    to,
    NavigationFailureType.aborted,
    `Navigation aborted from "${from.fullPath}" to "${to.fullPath}" via a navigation guard.`,
  )
}

function createRouterError(
  from: Route,
  to: Route,
  type: NavigationFailureType,
  message: string,
): NavigationFailure {
  const error = new Error(message) as NavigationFailure
  error._isRouter = true
  error.from = from
  error.to = to
  error.type = type

  return error
}

const propertiesToLog = ['params', 'query', 'hash'] as const

function stringifyRoute(to: Route) {
  if (typeof to === 'string') return to
  if ('path' in to) return to.path
  const location: Partial<Record<(typeof propertiesToLog)[number], string>> = {}
  propertiesToLog.forEach((key) => {
    if (key in to) location[key] = to[key]
  })
  return JSON.stringify(location, null, 2)
}

export function isError(err: unknown): err is Error {
  return Object.prototype.toString.call(err).indexOf('Error') > -1
}

/**
 * Check if an object is a {@link NavigationFailure}.
 */
export function isNavigationFailure(
  err: unknown,
  errorType?: NavigationFailureType,
): err is NavigationFailure {
  return (
    isError(err) &&
    '_isRouter' in err &&
    (errorType == null || ('type' in err && err.type === errorType))
  )
}
