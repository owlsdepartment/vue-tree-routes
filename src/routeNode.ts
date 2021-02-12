import { RouteDefinition, RouteConfig, SharedData, Meta } from './types'
import { isString } from './helpers'

export interface RouteNodeParams {
    shared?: SharedData;
    routes?: RouteConfig[];
    children?: RouteNode[];
}

export class RouteNode implements RouteDefinition {
    shared: SharedData;
    routes: RouteConfig[];
    children: RouteNode[];
    private merged: boolean = false;

    constructor({ shared = {}, routes = [], children = [] }: RouteNodeParams) {
        this.shared = shared;
        this.routes = routes;
        this.children = children;
    }

    *[Symbol.iterator](): Generator<RouteConfig> {
        const { basePath, meta } = this.shared;

        for (let route of this.routes) {
            applyNewPath(route, basePath);
            applyNewMeta(route, meta);

            yield route;
        }

        for (let child of this.children) {
            child.mergeSharedData(this.shared);

            yield* child;
        }
    }

    private mergeSharedData(parentShared: SharedData) {
        if (this.merged) return;

        const { shared } = this;

        this.shared = {
            basePath: concatPaths(parentShared.basePath ?? "", shared.basePath ?? ""),
            meta: shared.meta !== undefined ? shared.meta : parentShared.meta
        };
        this.merged = true
    }
}

function applyNewPath(route: RouteConfig, basePath?: string): void {
    const { path } = route;

    if (isString(path)) {
        route.path = concatPaths(basePath ?? "", path);
    }
}

function applyNewMeta(route: RouteConfig, meta: Meta = {}): void {
    if (route.meta === undefined) {
        route.meta = { ...meta };
    }

    if (Array.isArray(route.children)) {
        route.children?.forEach(child => applyNewMeta(child, meta))
    }
}

function concatPaths(basePath: string, path: string): string {
    if (!isString(basePath) || !isString(path)) {
        throw "basePath and path must be strings";
    }

    if (basePath[basePath.length - 1] === "/") {
        basePath = basePath.slice(0, basePath.length - 1);
    }

    if (path[0] === "/") {
        path = path.slice(1);
    }

    return `${basePath}/${path}`;
}
