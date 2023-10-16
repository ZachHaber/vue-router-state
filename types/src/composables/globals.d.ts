import { ShallowReactive } from 'vue';
import type { Route } from '../util/route';
export declare function useRouter(): import("..").default;
export declare function useRoute(): ShallowReactive<Route<import("../types/declarations").Dictionary<any>>>;
export declare function useRouteState(): import("vue").ComputedRef<import("../types/declarations").Dictionary<any> | undefined>;
