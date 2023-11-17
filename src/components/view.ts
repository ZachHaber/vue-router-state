import { defineComponent } from '../util/defineComponent'
import type { CreateElement } from 'vue'
import type {
  Component,
  ParentNodeExtras,
  VNodeDataWithExtras,
} from '../types/declarations'
import { extend } from '../util/misc'
import { handleRouteEntered, Route, RouteRecord } from '../util/route'
import { warn } from '../util/warn'

export interface RouterViewProps {
  /**
   * When a {@link RouterView | `<RouterView />`} has a name, it will render the component with the corresponding name
   * in the matched route record's components option. See [Named
   * Views](https://v3.router.vuejs.org/guide/essentials/named-views.html) for an example.
   *
   * @default "default"
   */
  name?: string
}
/**
 * Component to display the current route the user is at.
 */
const RouterView = defineComponent<RouterViewProps>({
  name: 'RouterView',
  functional: true as unknown as never,
  props: {
    name: {
      type: String,
      default: 'default',
    },
  },
  render(_, { props, children, parent: _parent, data: _data }) {
    // used by devtools to display a router-view badge
    const data = _data as VNodeDataWithExtras
    data.routerView = true
    let parent: ParentNodeExtras = _parent as any

    // directly use parent context's createElement() function
    // so that components rendered by router-view can resolve named slots
    const h: CreateElement = (parent as any).$createElement
    const name = props.name as string
    const route = parent.$route
    const cache = parent._routerViewCache || (parent._routerViewCache = {})

    // determine current view depth, also check to see if the tree
    // has been toggled inactive but kept-alive.
    let depth = 0
    let inactive = false
    while (parent && parent._routerRoot !== parent) {
      const vnodeData: VNodeDataWithExtras | undefined = parent.$vnode
        ? (parent.$vnode.data as any)
        : {}
      if (vnodeData) {
        if (vnodeData.routerView) {
          depth++
        }
        if (vnodeData.keepAlive && parent._directInactive && parent._inactive) {
          inactive = true
        }
      }
      parent = parent.$parent as any
    }
    data.routerViewDepth = depth

    // render previous view if the tree is inactive and kept-alive
    if (inactive) {
      const cachedData = cache[name]
      const cachedComponent = cachedData && cachedData.component
      if (cachedComponent) {
        // #2301
        // pass props
        if (cachedData.configProps) {
          fillPropsinData(
            cachedComponent,
            data,
            cachedData.route,
            cachedData.configProps,
          )
        }
        return h(cachedComponent, data, children)
      } else {
        // render previous empty view
        return h()
      }
    }

    const matched = route.matched[depth]
    const component = matched && matched.components[name]

    // render empty node if no matched route or no config component
    if (!matched || !component) {
      cache[name] = null
      return h()
    }

    // cache component
    cache[name] = { component }

    // attach instance registration hook
    // this will be called in the instance's injected lifecycle hooks
    data.registerRouteInstance = (vm, val) => {
      // val could be undefined for unregistration
      const current = matched.instances[name]
      if ((val && current !== vm) || (!val && current === vm)) {
        matched.instances[name] = val!
      }
    }

    // also register instance in prepatch hook
    // in case the same component instance is reused across different routes
    ;(data.hook || (data.hook = {})).prepatch = (_, vnode) => {
      const instance = vnode.componentInstance
      if (instance) {
        matched.instances[name] = instance
      }
    }

    // register instance in init hook
    // in case kept-alive component be actived when routes changed
    data.hook.init = (vnode) => {
      if (
        (vnode.data as VNodeDataWithExtras).keepAlive &&
        vnode.componentInstance &&
        vnode.componentInstance !== matched.instances[name]
      ) {
        matched.instances[name] = vnode.componentInstance
      }

      // if the route transition has already been confirmed then we weren't
      // able to call the cbs during confirmation as the component was not
      // registered yet, so we call it here.
      handleRouteEntered(route)
    }

    const configProps = matched.props && matched.props[name]
    // save route and configProps in cache
    if (configProps) {
      extend(cache[name], {
        route,
        configProps,
      })
      fillPropsinData(component, data, route, configProps)
    }

    return h(component, data, children)
  },
})
export default RouterView as new () => {
  $props: RouterViewProps
}

function fillPropsinData(
  component: Component,
  data: VNodeDataWithExtras,
  route: Route,
  configProps: RouteRecord['props']['default'],
) {
  // resolve props
  let propsToPass = (data.props = resolveProps(route, configProps))
  if (propsToPass) {
    // clone to prevent mutation
    propsToPass = data.props = extend({}, propsToPass)
    // pass non-declared props as attrs
    const attrs = (data.attrs = data.attrs || {})
    for (const key in propsToPass) {
      if (!('props' in component) || !(key in component.props)) {
        attrs[key] = propsToPass[key]
        delete propsToPass[key]
      }
    }
  }
}

function resolveProps(route: Route, config: RouteRecord['props']['default']) {
  switch (typeof config) {
    case 'undefined':
      return
    case 'object':
      return config
    case 'function':
      return config(route)
    case 'boolean':
      return config ? route.params : undefined
    default:
      // @ts-ignore
      if (process.env.NODE_ENV !== 'production') {
        warn(
          false,
          `props in "${route.path}" is a ${typeof config}, ` +
            `expecting an object, function or boolean.`,
        )
      }
  }
}
