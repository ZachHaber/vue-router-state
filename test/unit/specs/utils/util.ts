import { Route, RouteConfig } from '#src/util/route'

export function minRoute(
  config: RouteConfig | (Partial<Exclude<Route, 'path'>> & { path?: string }),
): Route {
  const asRoute = config as Route
  return {
    fullPath: asRoute.fullPath || 'https://localhost' + config.path,
    hash: asRoute.hash || config.path?.match(/#(.*)/)?.[1] || '',
    matched: asRoute.matched || [],
    params: asRoute.params || {},
    path: config.path || '',
    query: asRoute.query || {},
    meta: config.meta,
    name: config.name,
    state: asRoute.state,
    redirectedFrom: asRoute.redirectedFrom,
  }
}
