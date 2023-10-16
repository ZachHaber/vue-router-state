import type VueRouter from './router';
import { Location, RawLocation } from './util/location';
import { Route, RouteConfig, RouteRecord } from './util/route';
export type Matcher = {
    match: (raw: RawLocation, current?: Route, redirectedFrom?: Location) => Route;
    addRoutes: (routes: Array<RouteConfig>) => void;
    addRoute: (parentNameOrRoute: string | RouteConfig, route?: RouteConfig) => void;
    getRoutes: () => Array<RouteRecord>;
};
export declare function createMatcher(routes: Array<RouteConfig>, router?: VueRouter): Matcher;
