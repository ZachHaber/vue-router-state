import type Vue from 'vue'
import type {
  AsyncComponent,
  Component as _Component,
  VNode,
  VNodeData,
} from 'vue'
import VueRouter from '../router'
import type { NavigationGuard, Route, RouteRecord } from '../util/route'
import type RouterLink from '../components/link'
import type RouterView from '../components/view'
export type Dictionary<T> = { [key: string]: T }
export type ErrorHandler = (err: Error) => void
export type Nullable<T> = T | null
export type Maybe<T> = T | null | undefined

export type RouterMode = 'hash' | 'history' | 'abstract'

declare module 'vue' {
  export interface GlobalComponents {
    RouterLink: typeof RouterLink
    RouterView: typeof RouterView
  }
}

// Use a file extension here so that without https://github.com/vuejs/vue/pull/13107
// this will work correctly without patching vue's package.json file
declare module 'vue/types/vue.js' {
  export interface Vue {
    $router: VueRouter
    $route: Route
  }
}

// Use a file extension here so that without https://github.com/vuejs/vue/pull/13107
// this will work correctly without patching vue's package.json file
declare module 'vue/types/options.js' {
  export interface ComponentOptions<V extends Vue> {
    router?: VueRouter
    beforeRouteEnter?: NavigationGuard<[V] extends [never] ? Vue : V>
    beforeRouteLeave?: NavigationGuard<[V] extends [never] ? Vue : V>
    beforeRouteUpdate?: NavigationGuard<[V] extends [never] ? Vue : V>
  }
}
export type Component =
  // | {}
  _Component<any, any, any, any> | AsyncComponent<any, any, any, any>

export type VNodeDataWithExtras = VNodeData & {
  routerView?: boolean
  routerViewDepth?: number
  registerRouteInstance?: (vm: Vue, val?: Vue) => void
  hook: {
    prepatch?: (_: any, vnode: VNode) => void
    init?: (vnode: VNode) => void
  }
}
export type CacheData =
  | {
      component: Component
      route: Route
      configProps: RouteRecord['props']['default']
    }
  | {
      component: Component
      route?: undefined
      configProps?: undefined
    }
export type ParentNodeExtras = Vue & {
  _routerViewCache: Dictionary<CacheData | null>
  _routerRoot: Vue
  _router: VueRouter
  _directInactive?: boolean
  _inactive?: boolean
}

export type AfterNavigationHook = (to: Route, from: Route) => void

export interface RouteMeta extends Record<string | number | symbol, any> {}

/**
 * Component to render a link that triggers a navigation on click.
 */
// export declare const RouterLink: new () => {
//   $props: RouterLinkProps
//   $scopedSlots: {
//     default?: ({
//       href,
//       route,
//       navigate,
//       isActive,
//       isExactActive,
//     }: RouterLinkSlotArgument) => VNode[] | undefined
//   }
// }

export declare class RouteRegExp extends RegExp {
  keys: Array<{ name: string; optional: boolean }>
}
