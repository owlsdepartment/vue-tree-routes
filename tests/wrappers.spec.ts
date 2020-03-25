import { createRouteNode, createRoot } from '../src/wrappers'
import { RouteNode } from '../src/routeNode'
import { RouteDefinition } from '../src/types'

describe('Wrappers', () => {
    describe('Create Route Node', () => {
        it('creates RouteNode instance for passed config', () => {
            const node = createRouteNode({})

            expect(node).toBeInstanceOf(RouteNode)
        })

        it('properly uses config param', () => {
            const config: RouteDefinition = {
                shared: { basePath: '', meta: {} },
                routes: [{ name: 'test', path: '/' }],
                children: [
                    new RouteNode({}),
                    new RouteNode({ routes: [{ name: 'other-test', path: '/other' }] })
                ]
            }
            const node = createRouteNode(config)

            expect(node.shared).toEqual(config.shared)
            expect(node.routes).toEqual(config.routes)
            expect(node.children).toEqual(config.children)
        })

        it('ensures children will be instances of RouteNode', () => {
            const config: RouteDefinition = {
                children: [
                    { shared: {}, routes: [] },
                    {
                        shared: { basePath: '' },
                        routes: [{ name: '', path: '' }],
                        children: [
                            { shared: {}, routes: [] }
                        ]
                    },
                    new RouteNode({})
                ]
            }
            const node = createRouteNode(config)

            for (let child of node.children) {
                expect(child).toBeInstanceOf(RouteNode)
            }
        })
    })

    describe('Create Root', () => {
        it('returns RouteNode instance', () => {
            const root_1 = createRoot([]);
            const root_2 = createRoot([
                { shared: {}, routes: [], children: [] }
            ])

            expect(root_1).toBeInstanceOf(RouteNode)
            expect(root_2).toBeInstanceOf(RouteNode)
        })
    })
})
