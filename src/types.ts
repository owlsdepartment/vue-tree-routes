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

export type RouteConfig = { meta?: Meta; } & VueRouteConfig

export interface Meta extends _Meta {
    [key: string]: any;
}

export interface _Meta {}
