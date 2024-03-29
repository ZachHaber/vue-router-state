import type VueRouter from '../router';
import type { Maybe } from '../types/declarations';
import type { RawLocation } from '../util/location';
import { Route } from '../util/route';
export declare abstract class History {
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
