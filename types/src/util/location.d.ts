import type VueRouter from '../router';
import type { Dictionary, Maybe } from '../types/declarations';
import type { Route } from './route';
export interface NormalizedLocation<State = Dictionary<any>> extends Location<State> {
    _normalized: true;
}
export interface Location<State = Dictionary<any>> {
    name?: string;
    path?: string;
    hash?: string;
    query?: Dictionary<string | (string | null)[] | null>;
    params?: Dictionary<string>;
    state?: State;
    append?: boolean;
    replace?: boolean;
}
export type RawLocation<State = Dictionary<any>> = string | Location<State>;
export declare function normalizeLocation<State = Dictionary<any>>(raw: RawLocation<State> | NormalizedLocation<State>, current?: Maybe<Route>, append?: Maybe<boolean>, router?: Maybe<VueRouter>): NormalizedLocation<State>;
