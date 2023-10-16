import type Vue from 'vue';
import VueRouter from '../router';
import type { Component, Dictionary, Maybe, RouteMeta, RouteRegExp } from '../types/declarations';
import { Location, RawLocation } from './location';
export type NavigationGuardNext<V extends Vue = Vue> = (to?: RawLocation | false | ((vm: V) => any) | void) => void;
export type NavigationGuard<V extends Vue = Vue> = (to: Route, from: Route, next: NavigationGuardNext<V>) => any;
export interface PathToRegexpOptions {
    sensitive?: boolean;
    strict?: boolean;
    end?: boolean;
}
export type RedirectOption = RawLocation | ((to: Route) => RawLocation);
export type RoutePropsFunction = (route: Route) => Object;
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
export interface RouteConfigSingleView extends _RouteConfigBase {
    component?: Component;
    props?: boolean | Object | RoutePropsFunction;
}
export interface RouteConfigMultipleViews extends _RouteConfigBase {
    components?: Dictionary<Component>;
    props?: Dictionary<boolean | Object | RoutePropsFunction>;
}
export type RouteConfig = RouteConfigSingleView | RouteConfigMultipleViews;
export interface RouteRecordPublic {
    path: string;
    components: Dictionary<Component>;
    instances: Dictionary<Vue>;
    name?: string;
    redirect?: RedirectOption;
    meta: any;
    beforeEnter?: (route: Route, redirect: (location: RawLocation) => void, next: () => void) => any;
    props: boolean | RoutePropsFunction | Dictionary<boolean | Object | RoutePropsFunction>;
}
export interface RouteRecord {
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
    props: Dictionary<boolean | Object | RoutePropsFunction>;
}
export interface Route<State = Dictionary<any>> {
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
export declare function createRoute(record: Maybe<RouteRecord>, location: Location, redirectedFrom?: Maybe<Location>, router?: VueRouter): Route;
/**
 * Initial route location where the router is. Can be used in navigation guards to differentiate the initial navigation.
 */
export declare const START: Route<Dictionary<any>>;
export declare function isSameRoute(a: Route, b: Maybe<Route>, onlyPath?: Maybe<boolean>): boolean;
export declare function isIncludedRoute(current: Route, target: Route): boolean;
export declare function handleRouteEntered(route: Route): void;
export {};
