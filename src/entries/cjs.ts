// export { default as RouterLink } from '../components/link'
export type {
  RouterLinkProps,
  RouterLinkSlotArgument,
} from '../components/link'
// export { default as RouterView } from '../components/view'
export type { RouterViewProps } from '../components/view'
export type { RouterOptions } from '../router'
export type { RouteMeta, RouterMode } from '../types/declarations'
export type { NavigationFailureType } from '../util/errors'
export type { NavigationFailure } from '../util/errors'
export type { Location, RawLocation } from '../util/location'
// export { START as START_LOCATION } from '../util/route'
export type {
  NavigationGuard,
  NavigationGuardNext,
  PathToRegexpOptions,
  RedirectOption,
  Route,
  RouteConfig,
  RouteRecord,
  RouteRecordPublic,
} from '../util/route'
import VueRouter from '../router'

// export const version = VueRouter.version
// we can't add the other composables here because people could still be using an older version of vue and that would
// create a compilation error trying to import from vue
export default VueRouter
