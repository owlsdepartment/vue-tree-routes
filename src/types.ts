import { RouteRecordRaw as VueRouteRecord } from 'vue-router'

export interface RouteDefinition {
    shared?: SharedData;
    routes?: RouteRecord[];
    children?: RouteDefinition[];
}

export interface SharedData {
    basePath?: string;
    meta?: Meta;
}

export type RouteRecord = { meta?: Meta; } & VueRouteRecord

export interface Meta extends _Meta {
    [key: string]: any;
}

export interface _Meta {}
