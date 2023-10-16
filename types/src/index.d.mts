export { default as RouterLink } from './components/link';
export type { RouterLinkProps, RouterLinkSlotArgument } from './components/link';
export { default as RouterView } from './components/view';
export type { RouterViewProps } from './components/view';
export type { RouterOptions } from './router';
export type { RouteMeta, RouterMode } from './types/declarations';
export { isNavigationFailure, NavigationFailureType } from './util/errors';
export type { NavigationFailure } from './util/errors';
export type { Location, RawLocation } from './util/location';
export { START as START_LOCATION } from './util/route';
export type { NavigationGuard, NavigationGuardNext, PathToRegexpOptions, RedirectOption, Route, RouteConfig, RouteRecord, RouteRecordPublic, } from './util/route';
import VueRouter from './router';
export declare const version: string;
export default VueRouter;
