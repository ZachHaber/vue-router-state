import type VueRouter from '../router';
import type { Route } from './route';
export type Position = {
    x: number;
    y: number;
};
export type PositionResult = Position | {
    selector: string;
    offset?: Position;
    behavior?: ScrollBehavior;
} | void;
export declare function setupScroll(): () => void;
export declare function handleScroll(router: VueRouter, to: Route, from: Route, isPop: boolean): void;
export declare function saveScrollPosition(): void;
