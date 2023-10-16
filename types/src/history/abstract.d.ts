import type { Maybe } from '../types/declarations';
import type VueRouter from '../router';
import { History } from './base';
import type { Route } from '../util/route';
import type { RawLocation } from '../util/location';
export declare class AbstractHistory extends History {
    index: number;
    stack: Array<Route>;
    constructor(router: VueRouter, base: Maybe<string>);
    push(location: RawLocation, onComplete?: (route: Route) => void, onAbort?: Function): void;
    replace(location: RawLocation, onComplete?: (route: Route) => void, onAbort?: Function): void;
    go(n: number): void;
    getCurrentLocation(): string;
    ensureURL(): void;
}
