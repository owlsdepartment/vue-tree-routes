import { RouteConfig as VueRouteConfig } from 'vue-router'
import { OverrideProps } from './helpers/types'

export interface RouteDefinition {
    shared?: SharedData;
    routes?: RouteConfig[];
    children?: RouteDefinition[];
}

export interface SharedData {
    basePath?: string;
    meta?: Meta;
}

export type RouteConfig = OverrideProps<VueRouteConfig, { meta?: Meta; }>

export interface Meta extends _Meta {
    [key: string]: any;
}

export interface _Meta {}
