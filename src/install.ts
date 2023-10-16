import type { PluginFunction, VNode } from 'vue'
import Link from './components/link'
import View from './components/view'
import { ParentNodeExtras, VNodeDataWithExtras } from './types/declarations'

export let _Vue: Parameters<PluginFunction<never>>[0] // Vue & VueConstructor
export const install: PluginFunction<never> = (Vue) => {
  if ((install as any).installed && _Vue === Vue) return
  ;(install as any).installed = true

  _Vue = Vue

  const isDef = (v: unknown): v is NonNullable<typeof v> => v !== undefined

  const registerInstance = (vm: Vue | Vue, callVal?: Vue) => {
    let node = (vm.$options as any)._parentVnode as
      | (Omit<VNode, 'data'> & { data: VNodeDataWithExtras })
      | undefined
    if (node && node.data && node.data.registerRouteInstance) {
      node.data.registerRouteInstance(vm, callVal)
    }
    // if (
    //   isDef(i) &&
    //   isDef((i = i.data)) &&
    //   isDef((i = i.registerRouteInstance))
    // ) {
    // }
  }

  Vue.mixin({
    beforeCreate() {
      const routerThis: ParentNodeExtras = this as any
      if (isDef(this.$options.router)) {
        routerThis._routerRoot = this
        routerThis._routerRoot = this
        routerThis._router = this.$options.router
        routerThis._router.init(this)
        ;(Vue.util as any).defineReactive(
          this,
          '_route',
          routerThis._router.history.current,
        )
      } else {
        routerThis._routerRoot =
          (this.$parent && (this.$parent as ParentNodeExtras)._routerRoot) ||
          this
      }
      registerInstance(this, this)
    },
    destroyed() {
      registerInstance(this as Vue)
    },
  })

  Object.defineProperty(Vue.prototype, '$router', {
    get() {
      return this._routerRoot._router
    },
  })

  Object.defineProperty(Vue.prototype, '$route', {
    get() {
      return this._routerRoot._route
    },
  })

  Vue.component('RouterView', View)
  Vue.component('RouterLink', Link)

  const strats = Vue.config.optionMergeStrategies
  // use the same hook merging strategy for route hooks
  strats.beforeRouteEnter =
    strats.beforeRouteLeave =
    strats.beforeRouteUpdate =
      strats.created
}
