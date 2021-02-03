import { RouteRecordRaw as VueRouteRecord } from 'vue-router'
import { OverrideProps } from './helpers/types'

export interface RouteDefinition {
    shared?: SharedData;
    routes?: RouteRecord[];
    children?: RouteDefinition[];
}

export interface SharedData {
    basePath?: string;
    meta?: Meta;
}

export type RouteRecord = OverrideProps<VueRouteRecord, { meta?: Meta; }>

export interface Meta extends _Meta {
    [key: string]: any;
}

export interface _Meta {}
