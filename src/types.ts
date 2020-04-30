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

export interface RouteConfig extends VueRouteConfig {
    meta?: Meta;
}

export interface Meta extends _Meta {
    [key: string]: any;
}

export interface _Meta {}
