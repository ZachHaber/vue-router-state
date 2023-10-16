import { _Vue } from '../install'
import { warn } from './warn'
import { isError } from '../util/errors'
import type {
  NavigationGuard,
  NavigationGuardNext,
  Route,
  RouteRecord,
} from './route'
import type { Component, Maybe } from '../types/declarations'
import type Vue from 'vue'

export function resolveAsyncComponents(
  matched: Array<RouteRecord>,
): Maybe<NavigationGuard> {
  return (to: Route, from: Route, next: NavigationGuardNext) => {
    let hasAsync = false
    let pending = 0
    let error: Error | null = null

    flatMapComponents(matched, (def, _, match, key) => {
      // if it's a function and doesn't have cid attached,
      // assume it's an async component resolve function.
      // we are not using Vue's default async resolving mechanism because
      // we want to halt the navigation until the incoming component has been
      // resolved.
      if (typeof def === 'function' && (def as any).cid === undefined) {
        hasAsync = true
        pending++

        const resolve = once((resolvedDef: any) => {
          if (isESModule(resolvedDef)) {
            resolvedDef = resolvedDef.default
          }
          // save resolved on async factory in case it's used elsewhere
          ;(def as any).resolved =
            typeof resolvedDef === 'function'
              ? resolvedDef
              : _Vue.extend(resolvedDef)
          match.components[key] = resolvedDef
          pending--
          if (pending <= 0) {
            next()
          }
        })

        const reject = once((reason: unknown) => {
          const msg = `Failed to resolve async component ${key}: ${reason}`
          // @ts-ignore
          process.env.NODE_ENV !== 'production' && warn(false, msg)
          if (!error) {
            error = isError(reason) ? reason : new Error(msg)
            next(error)
          }
        })

        let res
        try {
          res = (def as any)(resolve, reject)
        } catch (e) {
          reject(e)
        }
        if (res) {
          if (typeof res.then === 'function') {
            res.then(resolve, reject)
          } else {
            // new syntax in Vue 2.3
            const comp = res.component
            if (comp && typeof comp.then === 'function') {
              comp.then(resolve, reject)
            }
          }
        }
      }
    })

    if (!hasAsync) next()
  }
}

export function flatMapComponents(
  matched: Array<RouteRecord>,
  fn: (
    component: Component,
    instance: Vue,
    record: RouteRecord,
    key: string,
  ) => void,
): Array<
  Maybe<
    (
      component: Component,
      instance: Vue,
      record: RouteRecord,
      key: string,
    ) => void
  >
> {
  return flatten(
    matched.map((m) => {
      return Object.keys(m.components).map((key) => {
        return fn(m.components[key], m.instances[key], m, key)
      })
    }),
  )
}
export function flatten(arr: Array<any>): Array<any> {
  return Array.prototype.concat.apply([], arr)
}

const hasSymbol =
  typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol'

function isESModule(obj: any) {
  return obj.__esModule || (hasSymbol && obj[Symbol.toStringTag] === 'Module')
}

// in Webpack 2, require.ensure now also returns a Promise
// so the resolve/reject functions may get called an extra time
// if the user uses an arrow function shorthand that happens to
// return that Promise.
function once(fn: Function): Function {
  let called = false
  return function (this: any, ...args: any[]) {
    if (called) return
    called = true
    return fn.apply(this, args)
  }
}
