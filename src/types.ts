import { RouteMeta, RouteRecordRaw as VueRouteRecord } from 'vue-router'

export interface RouteDefinition {
    shared?: SharedData;
    routes?: RouteRecord[];
    children?: RouteDefinition[];
}

export interface SharedData {
    basePath?: string;
    meta?: RouteMeta;
}

export type RouteRecord = VueRouteRecord
