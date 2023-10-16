import Vue from "vue";
import { AsyncComponent } from "vue";
import { Component as _Component } from "vue";
type Dictionary<T> = {
    [key: string]: T;
};
type ErrorHandler = (err: Error) => void;
type Maybe<T> = T | null | undefined;
type RouterMode = "hash" | "history" | "abstract";
declare module "vue/types/vue" {
    interface Vue {
        $router: VueRouter;
        $route: Route;
    }
}
declare module "vue/types/options" {
    interface ComponentOptions<V extends Vue> {
        router?: VueRouter;
        beforeRouteEnter?: NavigationGuard<[
            V
        ] extends [
            never
        ] ? Vue : V>;
        beforeRouteLeave?: NavigationGuard<[
            V
        ] extends [
            never
        ] ? Vue : V>;
        beforeRouteUpdate?: NavigationGuard<[
            V
        ] extends [
            never
        ] ? Vue : V>;
    }
}
type Component = 
// | {}
_Component<any, any, any, any> | AsyncComponent<any, any, any, any>;
type AfterNavigationHook = (to: Route, from: Route) => void;
interface RouteMeta extends Record<string | number | symbol, any> {
}
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
declare class RouteRegExp extends RegExp {
    keys: Array<{
        name: string;
        optional: boolean;
    }>;
}
interface Location<State = Dictionary<any>> {
    name?: string;
    path?: string;
    hash?: string;
    query?: Dictionary<string | (string | null)[] | null>;
    params?: Dictionary<string>;
    state?: State;
    append?: boolean;
    replace?: boolean;
}
type RawLocation<State = Dictionary<any>> = string | Location<State>;
type NavigationGuardNext<V extends Vue = Vue> = (to?: RawLocation | false | ((vm: V) => any) | void) => void;
type NavigationGuard<V extends Vue = Vue> = (to: Route, from: Route, next: NavigationGuardNext<V>) => any;
interface PathToRegexpOptions {
    sensitive?: boolean;
    strict?: boolean;
    end?: boolean;
}
type RedirectOption = RawLocation | ((to: Route) => RawLocation);
type RoutePropsFunction = (route: Route) => Object;
interface _RouteConfigBase {
    path: string;
    name?: string;
    children?: RouteConfig[];
    redirect?: RedirectOption;
    alias?: string | string[];
    meta?: RouteMeta;
    beforeEnter?: NavigationGuard;
    caseSensitive?: boolean;
    pathToRegexpOptions?: PathToRegexpOptions;
}
interface RouteConfigSingleView extends _RouteConfigBase {
    component?: Component;
    props?: boolean | Object | RoutePropsFunction;
}
interface RouteConfigMultipleViews extends _RouteConfigBase {
    components?: Dictionary<Component>;
    props?: Dictionary<boolean | Object | RoutePropsFunction>;
}
type RouteConfig = RouteConfigSingleView | RouteConfigMultipleViews;
interface RouteRecord {
    path: string;
    regex: RouteRegExp;
    components: Dictionary<Component>;
    alias: string[];
    instances: Dictionary<Vue>;
    name?: string;
    parent?: RouteRecord;
    redirect?: RedirectOption;
    matchAs?: string;
    meta: RouteMeta;
    enteredCbs: Record<string, NavigationGuardNext[]>;
    beforeEnter?: Maybe<NavigationGuard>;
    props: 
    // | RoutePropsFunction
    Dictionary<boolean | Object | RoutePropsFunction>;
}
interface Route<State = Dictionary<any>> {
    path: string;
    name?: string | null;
    hash: string;
    query: Dictionary<string | null | (string | null)[]>;
    params: Dictionary<string>;
    state?: State;
    fullPath: string;
    matched: RouteRecord[];
    redirectedFrom?: string;
    meta?: RouteMeta;
}
/**
 * Enumeration with all possible types for navigation failures.
 *
 * Can be passed to {@link isNavigationFailure} to check for specific failures.
 */
declare enum NavigationFailureType {
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
    duplicated = 16
}
/**
 * Extended Error that contains extra information regarding a failed navigation.
 */
interface NavigationFailure extends Error {
    /**
     * @internal
     */
    _isRouter: true;
    /**
     * Route location we were navigating from
     */
    from: Route;
    /**
     * Route location we were navigating to
     */
    to: Route;
    /**
     * Type of the navigation. One of {@link NavigationFailureType}
     */
    type: NavigationFailureType;
}
/**
 * Check if an object is a {@link NavigationFailure}.
 */
declare function isNavigationFailure(err: unknown, errorType?: NavigationFailureType): err is NavigationFailure;
type Position = {
    x: number;
    y: number;
};
type PositionResult = Position | {
    selector: string;
    offset?: Position;
    behavior?: ScrollBehavior;
} | void;
declare abstract class History {
    router: VueRouter;
    base: string;
    current: Route;
    pending: Maybe<Route>;
    cb?: (r: Route) => void;
    ready: boolean;
    readyCbs: Array<Function>;
    readyErrorCbs: Array<Function>;
    errorCbs: Array<Function>;
    listeners: Array<Function>;
    // cleanupListeners: Function
    // implemented by sub-classes
    abstract go(n: number): void;
    abstract push(loc: RawLocation, onComplete?: (route: Route) => void, onAbort?: Function): void;
    abstract replace(loc: RawLocation, onComplete?: (route: Route) => void, onAbort?: Function): void;
    abstract ensureURL(push?: boolean): void;
    abstract getCurrentLocation(): string;
    constructor(router: VueRouter, base: Maybe<string>);
    listen(cb: (r: Route) => void): void;
    onReady(cb: Function, errorCb: Maybe<Function>): void;
    onError(errorCb: Function): void;
    transitionTo(location: RawLocation, onComplete?: (route: Route) => void, onAbort?: Function): void;
    confirmTransition(route: Route, onComplete: Function, onAbort?: (err: unknown) => void): void;
    updateRoute(route: Route): void;
    setupListeners(): void;
    teardown(): void;
}
declare class AbstractHistory extends History {
    index: number;
    stack: Array<Route>;
    constructor(router: VueRouter, base: Maybe<string>);
    push(location: RawLocation, onComplete?: (route: Route) => void, onAbort?: Function): void;
    replace(location: RawLocation, onComplete?: (route: Route) => void, onAbort?: Function): void;
    go(n: number): void;
    getCurrentLocation(): string;
    ensureURL(): void;
}
declare class HashHistory extends History {
    constructor(router: VueRouter, base: Maybe<string>, fallback: boolean);
    // this is delayed until the app mounts
    // to avoid the hashchange listener being fired too early
    setupListeners(): void;
    push(location: RawLocation, onComplete?: (route: Route) => void, onAbort?: Function): void;
    replace(location: RawLocation, onComplete?: (route: Route) => void, onAbort?: Function): void;
    go(n: number): void;
    ensureURL(push?: boolean): void;
    getCurrentLocation(): string;
}
declare class HTML5History extends History {
    _startLocation: string;
    constructor(router: VueRouter, base: Maybe<string>);
    setupListeners(): void;
    go(n: number): void;
    push(location: RawLocation, onComplete?: (route: Route) => void, onAbort?: Function): void;
    replace(location: RawLocation, onComplete?: (route: Route) => void, onAbort?: Function): void;
    ensureURL(push?: boolean): void;
    getCurrentLocation(): string;
}
type Matcher = {
    match: (raw: RawLocation, current?: Route, redirectedFrom?: Location) => Route;
    addRoutes: (routes: Array<RouteConfig>) => void;
    addRoute: (parentNameOrRoute: string | RouteConfig, route?: RouteConfig) => void;
    getRoutes: () => Array<RouteRecord>;
};
type Query = Dictionary<string | null | (string | null)[]>;
/**
 * Options to initialize a {@link VueRouter} instance.
 */
interface RouterOptions {
    routes?: RouteConfig[];
    /**
     * Configure the router mode.
     *
     * default: `"hash"` (in browser) | `"abstract"` (in Node.js)
     *
     * available values: `"hash" | "history" | "abstract"`
     * - `"hash"`: uses the URL hash for routing. Works in all Vue-supported browsers, including those that do not support
     *   HTML5 History API.
     * - `"history"`: requires HTML5 History API and server config. See HTML5 History Mode.
     * - `"abstract"`: works in all JavaScript environments, e.g. server-side with Node.js. **The router will
     *   automatically be forced into this mode if no browser API is present.**
     */
    mode?: RouterMode;
    fallback?: boolean;
    base?: string;
    /**
     * Default class applied to active {@link RouterLink}. If none is provided, `router-link-active` will be applied.
     */
    linkActiveClass?: string;
    /**
     * Default class applied to active {@link RouterLink}. If none is provided, `router-link-exact-active` will be
     * applied.
     */
    linkExactActiveClass?: string;
    /**
     * Custom implementation to parse a query. See its counterpart, {@link stringifyQuery}.
     */
    parseQuery?: (query: string) => Query;
    /**
     * Custom implementation to stringify a query object. Should not prepend a leading `?`. {@link parseQuery} counterpart
     * to handle query parsing.
     */
    stringifyQuery?: (query: Query) => string;
    /**
     * Function to control scrolling when navigating between pages. Can return a Promise to delay scrolling.
     *
     * For more details see {@link Scroll Behavior}.
     */
    scrollBehavior?: (to: Route, from: Route, savedPosition: Position | void) => PositionResult | Promise<PositionResult> | undefined | null;
}
/**
 * Router instance.
 */
declare class VueRouter {
    /**
     * @internal
     */
    static install: import("vue").PluginFunction<never>;
    static version: string;
    static isNavigationFailure: typeof isNavigationFailure;
    static NavigationFailureType: typeof NavigationFailureType;
    /**
     * Initial route location where the router is. Can be used in navigation guards to differentiate the initial navigation.
     */
    static START_LOCATION: Route<Dictionary<any>>;
    app: Vue | null;
    apps: Array<Vue>;
    ready?: boolean;
    readyCbs?: Array<Function>;
    /**
     * Original options object passed to create the Router
     */
    options: RouterOptions;
    /**
     * Configured mode when creating the Router instance.
     */
    mode: RouterMode;
    history: HashHistory | HTML5History | AbstractHistory;
    matcher: Matcher;
    fallback: boolean;
    beforeHooks: Array<Maybe<NavigationGuard>>;
    resolveHooks: Array<Maybe<NavigationGuard>>;
    afterHooks: Array<Maybe<AfterNavigationHook>>;
    constructor(options?: RouterOptions);
    match(raw: RawLocation, current?: Route, redirectedFrom?: Location): Route;
    /**
     * Current {@link Route}
     */
    get currentRoute(): Route;
    init(app: any /* Vue component instance */): void;
    /**
     * Add a navigation guard that executes before any navigation.
     *
     * @param guard - navigation guard to add
     * @returns a function that removes the registered guard
     *
     * @example
     * ```js
     * router.beforeEach((to, from, next) => {
     *   // must call `next`
     * })
     * ```
     */
    beforeEach(fn: NavigationGuard): () => void;
    /**
     * Add a navigation guard that executes before navigation is about to be resolved. At this state all component have
     * been fetched and other navigation guards have been successful.
     *
     * @param guard - navigation guard to add
     * @returns a function that removes the registered guard
     *
     * @example
     * ```js
     * router.beforeResolve((to, from, next) => {
     *   // must call `next`
     * })
     * ```
     */
    beforeResolve(fn: NavigationGuard): () => void;
    /**
     * Add a navigation hook that is executed after every navigation. Returns a function that removes the registered hook.
     *
     * @param hook - navigation hook to add
     * @returns a function that removes the registered guard
     *
     * @example
     * ```js
     * router.afterEach((to, from) => {
     *   console.log('after navigation')
     * })
     * ```
     */
    afterEach(fn: NavigationGuard): () => void;
    /**
     * This method queues a callback to be called when the router has completed the initial navigation, which means it has
     * resolved all async enter hooks and async components that are associated with the initial route.
     *
     * This is useful in server-side rendering to ensure consistent output on both the server and the client.
     * @param cb onReady callback.
     * @param errorCb errorCb will be called when the initial route resolution runs into an error (e.g. failed to resolve
     * an async component).
     */
    onReady(cb: () => void, errorCb?: ErrorHandler): void;
    /**
     * Adds an error handler that is called every time a non caught error happens during navigation. This includes errors
     * thrown synchronously and asynchronously, errors returned or passed to `next` in any navigation guard, and errors
     * occurred when trying to resolve an async component that is required to render a route.
     *
     * @param handler - error handler to register
     */
    onError(errorCb: ErrorHandler): void;
    /**
     * Programmatically navigate to a new URL by pushing an entry in the history stack.
     *
     * @param to Route location to navigate to
     */
    push(to: RawLocation): Promise<Route>;
    /**
     * Programmatically navigate to a new URL by pushing an entry in the history stack.
     *
     * @param to Route location to navigate to
     * @param onComplete Navigation success callback
     * @param onAbort Navigation aborted callback
     */
    push(to: RawLocation, onComplete: (route: Route) => void, onAbort?: ErrorHandler): void;
    /**
     * Programmatically navigate to a new URL by replacing the current entry in the history stack.
     *
     * @param to Route location to navigate to
     */
    replace(to: RawLocation): Promise<Route>;
    /**
     * Programmatically navigate to a new URL by replacing the current entry in the history stack.
     *
     * @param to Route location to navigate to
     * @param onComplete Navigation success callback
     * @param onAbort Navigation aborted callback
     */
    replace(to: RawLocation, onComplete: (route: Route) => void, onAbort?: ErrorHandler): void;
    /**
     * Allows you to move forward or backward through the history. Calls `history.go()`.
     *
     * @param delta The position in the history to which you want to move, relative to the current page
     */
    go(n: number): void;
    /**
     * Go back in history if possible by calling `history.back()`. Equivalent to `router.go(-1)`.
     */
    back(): void;
    /**
     * Go forward in history if possible by calling `history.forward()`. Equivalent to `router.go(1)`.
     */
    forward(): void;
    getMatchedComponents(to?: RawLocation | Route): Array<Component>;
    /**
     *
     * @param to Route location
     * @param current current is the current Route by default (most of the time you don't need to change this)
     * @param append allows you to append the path to the `current` route (as with `router-link`)
     */
    resolve(to: RawLocation, current?: Route, append?: boolean): {
        location: Location;
        route: Route;
        href: string;
        // for backwards compat
        normalizedTo: Location;
        resolved: Route;
    };
    /**
     * Get the list of all the active route records.
     */
    getRoutes(): RouteRecord[];
    /**
     * Add a new {@link RouteConfig | route record} as the child of an existing route. If the route has a `name` and there
     * is already an existing one with the same one, it overwrites it.
     *
     * @param parentName - Parent Route Record where `route` should be appended at
     * @param route - Route Record to add
     */
    addRoute(parentName: string, route: RouteConfig): void;
    /**
     * Add a new {@link RouteConfig | route} to the router. If the route has a `name` and there is already an existing one
     * with the same one, it overwrites it.
     * @param route - Route Record to add
     */
    addRoute(route: RouteConfig): void;
    /**
     * @deprecated use {@link addRoute | router.addRoute()} instead
     */
    addRoutes(routes: Array<RouteConfig>): void;
}
export { VueRouter as default };
