import { RouteDefinition } from "./types";
import { RouteNode, RouteNodeParams } from "./routeNode";

export function createRouteNode({ shared, routes, children = [] }: RouteDefinition): RouteNode {
    let params: RouteNodeParams = { shared, routes, children: [] };

    for (let child of children) {
        params.children!.push(
            child instanceof RouteNode ? child : createRouteNode(child)
        )
    }

    return new RouteNode(params)
}

export function createRoot(children: RouteDefinition[]): RouteNode {
    return createRouteNode({ children })
}
