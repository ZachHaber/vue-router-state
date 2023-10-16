import type { NavigationGuard } from '../util/route';
/**
 * Add a navigation guard that triggers whenever the current location is about to be updated. Similar to beforeRouteUpdate but can be used in any component. The guard is removed when the component is unmounted.
 *
 * @param updateGuard
 */
export declare function onBeforeRouteUpdate(updateGuard: NavigationGuard): () => void;
/**
 * Add a navigation guard that triggers whenever the component for the current location is about to be left. Similar to beforeRouteLeave but can be used in any component. The guard is removed when the component is unmounted.
 *
 * @param leaveGuard
 */
export declare function onBeforeRouteLeave(leaveGuard: NavigationGuard): () => void;
