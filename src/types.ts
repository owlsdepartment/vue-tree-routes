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

export interface Meta {
    [key: string]: any;
}
