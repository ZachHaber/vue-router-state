import type { Maybe } from '../types/declarations';
import { NavigationGuard } from './route';
export declare function runQueue(queue: Array<Maybe<NavigationGuard>>, iterator: (guard: NavigationGuard, next: () => void) => void, onComplete: () => void): void;
