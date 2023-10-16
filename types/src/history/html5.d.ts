import type { Maybe } from '../types/declarations';
import type VueRouter from '../router';
import { RawLocation } from '../util/location';
import { Route } from '../util/route';
import { History } from './base';
export declare class HTML5History extends History {
    _startLocation: string;
    constructor(router: VueRouter, base: Maybe<string>);
    setupListeners(): void;
    go(n: number): void;
    push(location: RawLocation, onComplete?: (route: Route) => void, onAbort?: Function): void;
    replace(location: RawLocation, onComplete?: (route: Route) => void, onAbort?: Function): void;
    ensureURL(push?: boolean): void;
    getCurrentLocation(): string;
}
export declare function getLocation(base: string): string;
