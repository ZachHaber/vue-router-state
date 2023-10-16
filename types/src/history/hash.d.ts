import type { Maybe } from '../types/declarations';
import type VueRouter from '../router';
import type { RawLocation } from '../util/location';
import type { Route } from '../util/route';
import { History } from './base';
export declare class HashHistory extends History {
    constructor(router: VueRouter, base: Maybe<string>, fallback: boolean);
    setupListeners(): void;
    push(location: RawLocation, onComplete?: (route: Route) => void, onAbort?: Function): void;
    replace(location: RawLocation, onComplete?: (route: Route) => void, onAbort?: Function): void;
    go(n: number): void;
    ensureURL(push?: boolean): void;
    getCurrentLocation(): string;
}
export declare function getHash(): string;
