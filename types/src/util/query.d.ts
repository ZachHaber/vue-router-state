import { Dictionary } from '../types/declarations';
export type Query = Dictionary<string | null | (string | null)[]>;
export declare function decode(str: string): string;
export declare function resolveQuery(query?: string | null | undefined, extraQuery?: Query, _parseQuery?: Function | null | undefined): Query;
export declare function stringifyQuery(obj: Query): string;
