import { defineComponent } from '../util/defineComponent'
import { PropType, VNode } from 'vue'
import type { ScopedSlotChildren } from 'vue/types/vnode'
import { Dictionary } from '../types/declarations'
import { NavigationFailure } from '../util/errors'
import { Location, normalizeLocation } from '../util/location'
import { extend } from '../util/misc'
import { createRoute, isIncludedRoute, isSameRoute, Route } from '../util/route'
import { warn } from '../util/warn'
import VueRouter from '../router'
type EventTypes = 'click' | 'dblclick' | 'moustup' | 'mousedown'

// work around weird flow bug
const toTypes = [String, Object]
const eventTypes = [String, Array]

const noop = () => {}

let warnedCustomSlot: undefined | true
let warnedTagProp: undefined | true
let warnedEventProp: undefined | true

export interface RouterLinkProps {
  /**
   * Denotes the target route of the link. When clicked, the value of the `to` prop will be passed to
   * `router.push()` internally, so the value can be either a string or a location descriptor object.
   */
  to: string | Location
  /**
   * Setting `replace` prop will call `router.replace()` instead of `router.push()` when clicked, so the navigation will
   * not create a new history record.
   *
   * @default false
   */
  replace?: boolean
  /**
   * Setting `append` prop always appends the relative path to the current path. For example, assuming we are navigating
   * from `/a` to a relative link `b`, without `append` we will end up at `/b`, but with append we will end up at
   * `/a/b`.
   *
   * @default false
   */
  append?: boolean
  /**
   * Sometimes we want <RouterLink> to render as another tag, e.g <li>. Then we can use tag prop to specify which tag to
   * render to, and it will still listen to click events for navigation.
   *
   * @default "a"
   */
  tag?: string
  /**
   * Configure the active CSS class applied when the link is active. Note the default value can also be configured
   * globally via the `linkActiveClass` router constructor option.
   *
   * @default "router-link-active"
   */
  activeClass?: string
  /**
   * The default active class matching behavior is **inclusive match**. For example, `<RouterLink to="/a">` will get
   * this class applied as long as the current path starts with `/a/` or is `/a`.
   *
   * @default false
   */
  exact?: boolean
  /**
   * Allows matching only using the `path` section of the url, effectively ignoring the `query` and the `hash` sections.
   *
   * @default false
   */
  exactPath?: boolean
  /**
   * Configure the active CSS class applied when the link is active with exact path match. Note the default value can
   * also be configured globally via the `linkExactPathActiveClass` router constructor option.
   *
   * @default "router-link-exact-path-active"
   */
  exactPathActiveClass?: string

  /**
   * Specify the event(s) that can trigger the link navigation.
   *
   * @default 'click'
   */
  event?: EventTypes | EventTypes[]
  /**
   * Configure the active CSS class applied when the link is active with exact match. Note the default value can also be
   * configured globally via the `linkExactActiveClass` router constructor option.
   *
   * @default "router-link-exact-active"
   */
  exactActiveClass?: string
  /**
   * Configure the value of `aria-current` when the link is active with exact match. It must be one of the allowed
   * values for [aria-current](https://www.w3.org/TR/wai-aria-1.2/#aria-current) in the ARIA spec. In most cases, the
   * default of page should be the best fit.
   *
   * @default "page"
   */
  ariaCurrentValue?:
    | 'page'
    | 'step'
    | 'location'
    | 'date'
    | 'time'
    | 'true'
    | 'false'
  /**
   * In Vue Router 4, the v-slot API will by default wrap its content with an <a> element. Use the custom prop to remove this warning:
   * ```
   * <router-link v-slot="{ navigate, href }" custom></router-link>
   * ```
   */
  custom?: boolean
}

export interface RouterLinkSlotArgument {
  /**
   * resolved url. This would be the `href` attribute of an `a` element
   */
  href: string
  /**
   * resolved normalized location
   */
  route: Route
  /**
   * function to trigger the navigation. It will automatically prevent events when necessary, the same way `RouterLink`
   * does
   */
  navigate: (e?: MouseEvent) => Promise<undefined | NavigationFailure>
  /**
   * `true` if the [active class](https://v3.router.vuejs.org/api/#active-class) should be applied. Allows to apply an
   * arbitrary class
   */
  isActive: boolean
  /**
   * `true` if the [exact active class](https://v3.router.vuejs.org/api/#exact-active-class) should be applied. Allows
   * to apply an arbitrary class
   */
  isExactActive: boolean
}
/**
 * Component to render a link that triggers a navigation on click.
 */
const RouterLink = defineComponent<RouterLinkProps>({
  name: 'RouterLink',
  props: {
    to: {
      type: toTypes,
      required: true,
    },
    tag: {
      type: String,
      default: 'a',
    },
    custom: Boolean,
    exact: Boolean,
    exactPath: Boolean,
    append: Boolean,
    replace: Boolean,
    // eslint-disable-next-line vue/require-default-prop
    activeClass: String,
    // eslint-disable-next-line vue/require-default-prop
    exactActiveClass: String,
    ariaCurrentValue: {
      type: String as PropType<RouterLinkProps['ariaCurrentValue']>,
      default: 'page',
    },
    event: {
      type: eventTypes as PropType<RouterLinkProps['event']>,
      default: 'click',
    },
  },
  render(h: Function) {
    const router = this.$router as VueRouter
    const current = this.$route
    const { location, route, href } = router.resolve(
      this.to,
      current,
      this.append,
    )

    const classes: Dictionary<boolean> = {}
    const globalActiveClass = router.options.linkActiveClass
    const globalExactActiveClass = router.options.linkExactActiveClass
    // Support global empty active class
    const activeClassFallback =
      globalActiveClass == null ? 'router-link-active' : globalActiveClass
    const exactActiveClassFallback =
      globalExactActiveClass == null
        ? 'router-link-exact-active'
        : globalExactActiveClass
    const activeClass =
      this.activeClass == null ? activeClassFallback : this.activeClass
    const exactActiveClass: string =
      this.exactActiveClass == null
        ? exactActiveClassFallback
        : this.exactActiveClass

    const compareTarget = route.redirectedFrom
      ? createRoute(null, normalizeLocation(route.redirectedFrom), null, router)
      : route

    classes[exactActiveClass] = isSameRoute(
      current,
      compareTarget,
      this.exactPath,
    )
    classes[activeClass] =
      this.exact || this.exactPath
        ? classes[exactActiveClass]
        : isIncludedRoute(current, compareTarget)

    const ariaCurrentValue = classes[exactActiveClass]
      ? this.ariaCurrentValue
      : null

    const handler = (e: MouseEvent): void => {
      if (guardEvent(e)) {
        if (this.replace) {
          router.replace(location, noop)
        } else {
          router.push(location, noop)
        }
      }
    }

    const on: Partial<Record<EventTypes, (ev: MouseEvent) => void>> = {
      click: guardEvent,
    }
    if (Array.isArray(this.event)) {
      this.event.forEach((e) => {
        on[e] = handler
      })
    } else if (this.event) {
      on[this.event] = handler
    }

    const data: any = { class: classes }

    const scopedSlot: ScopedSlotChildren | false =
      !this.$scopedSlots.$hasNormal &&
      this.$scopedSlots.default &&
      this.$scopedSlots.default({
        href,
        route,
        navigate: handler,
        isActive: classes[activeClass],
        isExactActive: classes[exactActiveClass],
      })

    if (scopedSlot) {
      // @ts-ignore
      if (process.env.NODE_ENV !== 'production' && !this.custom) {
        !warnedCustomSlot &&
          warn(
            false,
            'In Vue Router 4, the v-slot API will by default wrap its content with an <a> element. Use the custom prop to remove this warning:\n<router-link v-slot="{ navigate, href }" custom></router-link>\n',
          )
        warnedCustomSlot = true
      }
      if (scopedSlot.length === 1) {
        return scopedSlot[0]
      } else if (scopedSlot.length > 1 || !scopedSlot.length) {
        // @ts-ignore
        if (process.env.NODE_ENV !== 'production') {
          warn(
            false,
            `<router-link> with to="${this.to}" is trying to use a scoped slot but it didn't provide exactly one child. Wrapping the content with a span element.`,
          )
        }
        return scopedSlot.length === 0 ? h() : h('span', {}, scopedSlot)
      }
    }

    // @ts-ignore
    if (process.env.NODE_ENV !== 'production') {
      if (this.$options.propsData) {
        if ('tag' in this.$options.propsData && !warnedTagProp) {
          warn(
            false,
            `<router-link>'s tag prop is deprecated and has been removed in Vue Router 4. Use the v-slot API to remove this warning: https://next.router.vuejs.org/guide/migration/#removal-of-event-and-tag-props-in-router-link.`,
          )
          warnedTagProp = true
        }
        if ('event' in this.$options.propsData && !warnedEventProp) {
          warn(
            false,
            `<router-link>'s event prop is deprecated and has been removed in Vue Router 4. Use the v-slot API to remove this warning: https://next.router.vuejs.org/guide/migration/#removal-of-event-and-tag-props-in-router-link.`,
          )
          warnedEventProp = true
        }
      }
    }

    if (this.tag === 'a') {
      data.on = on
      data.attrs = { href, 'aria-current': ariaCurrentValue }
    } else {
      // find the first <a> child and apply listener and href
      const a = findAnchor(this.$slots.default)
      if (a) {
        // in case the <a> is a static node
        a.isStatic = false
        const aData = (a.data = extend({}, a.data))
        aData.on = aData.on || {}
        // transform existing events in both objects into arrays so we can push later
        for (const event in aData.on) {
          const handler = aData.on[event]
          if (event in on) {
            aData.on[event] = Array.isArray(handler) ? handler : [handler]
          }
        }
        // append new listeners for router-link
        for (const event in on) {
          const eventType = event as EventTypes
          if (eventType in aData.on) {
            // on[event] is always a function
            const onValue = aData.on[eventType]
            if (Array.isArray(onValue)) {
              onValue.push(on[eventType]!)
            } else {
              aData.on[eventType] = [onValue, on[eventType]!]
            }
          } else {
            aData.on[eventType] = handler
          }
        }

        const aAttrs = (a.data.attrs = extend({}, a.data.attrs))
        aAttrs.href = href
        aAttrs['aria-current'] = ariaCurrentValue
      } else {
        // doesn't have <a> child, apply listener to self
        data.on = on
      }
    }

    return h(this.tag, data, this.$slots.default)
  },
})

export default RouterLink as unknown as new () => {
  $props: RouterLinkProps
  $scopedSlots: {
    default?: ({
      href,
      route,
      navigate,
      isActive,
      isExactActive,
    }: RouterLinkSlotArgument) => VNode[] | undefined
  }
}

export function guardEvent(e: MouseEvent) {
  // don't redirect with control keys
  if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) return
  // don't redirect when preventDefault called
  if (e.defaultPrevented) return
  // don't redirect on right click
  if (e.button !== undefined && e.button !== 0) return
  // don't redirect if `target="_blank"`
  if (e.currentTarget && e.currentTarget instanceof HTMLElement) {
    const target = e.currentTarget.getAttribute('target')
    if (target && /\b_blank\b/i.test(target)) return
  }
  // this may be a Weex event which doesn't have this method
  if (e.preventDefault) {
    e.preventDefault()
  }
  return true
}

function findAnchor(children: VNode[] | undefined): VNode | undefined {
  if (children) {
    let child: VNode | undefined
    for (let i = 0; i < children.length; i++) {
      child = children[i]
      if (child.tag === 'a') {
        return child
      }
      if (child.children && (child = findAnchor(child.children))) {
        return child
      }
    }
  }
}
