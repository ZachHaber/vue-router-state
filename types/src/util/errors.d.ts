import type { Route } from './route';
/**
 * Enumeration with all possible types for navigation failures.
 *
 * Can be passed to {@link isNavigationFailure} to check for specific failures.
 */
export declare enum NavigationFailureType {
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
export interface NavigationFailure extends Error {
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
export declare function createNavigationRedirectedError(from: Route, to: Route): NavigationFailure;
export declare function createNavigationDuplicatedError(from: Route, to: Route): NavigationFailure;
export declare function createNavigationCancelledError(from: Route, to: Route): NavigationFailure;
export declare function createNavigationAbortedError(from: Route, to: Route): NavigationFailure;
export declare function isError(err: unknown): err is Error;
/**
 * Check if an object is a {@link NavigationFailure}.
 */
export declare function isNavigationFailure(err: unknown, errorType?: NavigationFailureType): err is NavigationFailure;
