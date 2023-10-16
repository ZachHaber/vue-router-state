import { Dictionary } from './types/declarations';
import type { RouteConfig, RouteRecord } from './util/route';
export declare function createRouteMap(routes: Array<RouteConfig>, oldPathList?: Array<string>, oldPathMap?: Dictionary<RouteRecord>, oldNameMap?: Dictionary<RouteRecord>, parentRoute?: RouteRecord): {
    pathList: Array<string>;
    pathMap: Dictionary<RouteRecord>;
    nameMap: Dictionary<RouteRecord>;
};
