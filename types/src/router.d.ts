import { isNavigationFailure, NavigationFailureType } from './util/errors';
import { Location, RawLocation } from './util/location';
import { NavigationGuard, Route, RouteConfig } from './util/route';
import { Position, PositionResult } from './util/scroll';
import { AbstractHistory } from './history/abstract';
import { HashHistory } from './history/hash';
import { HTML5History } from './history/html5';
import Vue from 'vue';
import type { Matcher } from './create-matcher';
import { AfterNavigationHook, Component, ErrorHandler, Maybe, RouterMode } from './types/declarations';
import type { Query } from './util/query';
/**
 * Options to initialize a {@link VueRouter} instance.
 */
export interface RouterOptions {
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
export default class VueRouter {
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
    static START_LOCATION: Route<import("./types/declarations").Dictionary<any>>;
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
    init(app: any): void;
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
        normalizedTo: Location;
        resolved: Route;
    };
    /**
     * Get the list of all the active route records.
     */
    getRoutes(): import("./util/route").RouteRecord[];
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
