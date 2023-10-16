import type VueRouter from '../router'
import type { Dictionary, Maybe } from '../types/declarations'
import { extend } from './misc'
import { fillParams } from './params'
import { parsePath, resolvePath } from './path'
import { resolveQuery } from './query'
import type { Route } from './route'
import { warn } from './warn'

export interface NormalizedLocation<State = Dictionary<any>>
  extends Location<State> {
  _normalized: true
}
export interface Location<State = Dictionary<any>> {
  name?: string
  path?: string
  hash?: string
  query?: Dictionary<string | (string | null)[] | null>
  params?: Dictionary<string>
  state?: State
  append?: boolean
  replace?: boolean
}

export type RawLocation<State = Dictionary<any>> = string | Location<State>

export function normalizeLocation<State = Dictionary<any>>(
  raw: RawLocation<State> | NormalizedLocation<State>,
  current?: Maybe<Route>,
  append?: Maybe<boolean>,
  router?: Maybe<VueRouter>,
): NormalizedLocation<State> {
  let next: Location<State> | NormalizedLocation<State> =
    typeof raw === 'string' ? { path: raw } : raw
  // named target
  if ((next as NormalizedLocation<State>)._normalized) {
    return next as NormalizedLocation<State>
  } else if (next.name) {
    const normalized = extend({ _normalized: true as const }, next)
    const params = normalized.params
    if (params && typeof params === 'object') {
      normalized.params = extend({}, params)
    }
    return normalized
  }

  // relative params
  if (!next.path && next.params && current) {
    const normalized = extend({ _normalized: true as const }, next)
    const params: any = extend(extend({}, current.params), normalized.params)
    if (current.name) {
      normalized.name = current.name
      normalized.params = params
    } else if (current.matched.length) {
      const rawPath = current.matched[current.matched.length - 1].path
      normalized.path = fillParams(rawPath, params, `path ${current.path}`)
      // @ts-ignore
    } else if (process.env.NODE_ENV !== 'production') {
      warn(false, `relative params navigation requires a current route.`)
    }
    return normalized
  }

  const parsedPath = parsePath(next.path || '')
  const basePath = (current && current.path) || '/'
  const path = parsedPath.path
    ? resolvePath(parsedPath.path, basePath, append || next.append)
    : basePath

  const query = resolveQuery(
    parsedPath.query,
    next.query,
    router && router.options.parseQuery,
  )

  let hash = next.hash || parsedPath.hash
  if (hash && hash.charAt(0) !== '#') {
    hash = `#${hash}`
  }

  return {
    _normalized: true,
    path,
    query,
    hash,
    state: next.state,
  }
}
