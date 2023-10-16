import type { NavigationGuard, RouteRecord } from './route';
import type { Component, Maybe } from '../types/declarations';
import type Vue from 'vue';
export declare function resolveAsyncComponents(matched: Array<RouteRecord>): Maybe<NavigationGuard>;
export declare function flatMapComponents(matched: Array<RouteRecord>, fn: (component: Component, instance: Vue, record: RouteRecord, key: string) => void): Array<Maybe<(component: Component, instance: Vue, record: RouteRecord, key: string) => void>>;
export declare function flatten(arr: Array<any>): Array<any>;
