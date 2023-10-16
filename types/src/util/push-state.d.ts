import { Dictionary } from '../types/declarations';
import { RawLocation } from './location';
export declare const supportsPushState: boolean;
export declare function pushState(url?: string, replace?: boolean, state?: Dictionary<any>): void;
export declare function replaceState(url?: string, state?: Dictionary<any>): void;
export declare function getLocationState(location: RawLocation): Dictionary<any> | undefined;
export declare function stripStateKey(state?: Dictionary<any>): Dictionary<any> | undefined;
