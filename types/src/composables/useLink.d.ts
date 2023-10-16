import { Ref } from 'vue';
import type { RawLocation } from '../util/location';
import type { Dictionary } from '../types/declarations';
export declare function isSameRouteLocationParams(a: Record<string, string | string[]>, b: Record<string, string | string[]>): boolean;
export interface RouterLinkOptions {
    /**
     * Route Location the link should navigate to when clicked on.
     */
    to: RawLocation | Ref<RawLocation>;
    /**
     * Calls `router.replace` instead of `router.push`.
     */
    replace?: boolean;
}
export declare function useLink({ to, replace }: RouterLinkOptions): {
    href: import("vue").ComputedRef<string>;
    route: import("vue").ComputedRef<import("../index.mjs").Route<Dictionary<any>>>;
    isExactActive: import("vue").ComputedRef<boolean>;
    isActive: import("vue").ComputedRef<boolean>;
    navigate: (e: MouseEvent) => Promise<void> | Promise<import("../index.mjs").Route<Dictionary<any>>>;
};
