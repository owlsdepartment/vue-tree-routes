import { RouteConfig as VueRouteConfig } from 'vue-router'

export interface RouteDefinition {
    shared?: SharedData;
    routes?: RouteConfig[];
    children?: RouteDefinition[];
}

export interface SharedData {
    basePath?: string;
    meta?: Meta;
}

/**
 * Zaktualizować to jako 2 nowe wersje:
 *  - 1.1.0 - jako wsparcie <= Vue Router@3.3.2
 *  - 1.1.1 - wsparcie >= VueRouter@3.3.3
 */

export interface RouteConfig extends VueRouteConfig {
    meta?: Meta;
}

export interface Meta extends _Meta {
    [key: string]: any;
}

export interface _Meta {}
