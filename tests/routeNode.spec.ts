import { RouteNode, RouteNodeParams } from '../src/routeNode'
import { RouteRecordRaw } from 'vue-router'
import { Meta } from '../src/types'

describe('RouteNode class', () => {
    it('properly initializes fields', () => {
        const config: RouteNodeParams = {
            shared: { basePath: '', meta: {} },
            routes: [],
            children: []
        }
        const instance = new RouteNode(config)

        expect(instance.shared).toBe(config.shared)
        expect(instance.routes).toBe(config.routes)
        expect(instance.children).toBe(config.children)
    })

    it('has [Symbol.iterator] field', () => {
        const instance = new RouteNode({})

        expect(RouteNode.prototype.hasOwnProperty(Symbol.iterator)).toBe(true)
        expect([...instance]).toEqual([])
    })

    describe('when iterated', () => {
        it('returns empty array for no routes or children', () => {
            const node = new RouteNode({})

            expect([...node]).toEqual([])
        })

        it('returns array with one item for one route and empty children', () => {
            const node = new RouteNode({ routes: [{ name: 'test-route', path: '/path', component: {} }] })

            expect([...node]).toEqual([{ meta: {}, name: 'test-route', path: '/path', component: {} }])
        })

        it('returns array with one item for one child and empty routes', () => {
            const node = new RouteNode({ children: [
                new RouteNode({ routes: [{ name: 'test-route', path: '/path', component: {} }] })
            ]})

            expect([...node]).toEqual([{ meta: {}, name: 'test-route', path: '/path', component: {} }])
        })

        it('returns array with many routes fro many self routes and many children', () => {
            let children: RouteNode[] = []
            for (let i = 0; i < 3; i++) {
                children.push(new RouteNode({ routes: [{ name: `child-route-${i}`, path: `/child-path-${i}`, component: {} }] }))
            }
            const routes: RouteRecordRaw[] = [
                { name: 'root-route-1', path: '/root-path-1', component: {} },
                { name: 'root-route-2', path: '/root-path-1', component: {} }
            ]
            const node = new RouteNode({ routes, children })
            const output = [...node];

            expect(output).toContainEqual({ meta: {}, name: 'root-route-1', path: '/root-path-1', component: {} })
            expect(output).toContainEqual({ meta: {}, name: 'root-route-2', path: '/root-path-1', component: {} })
            expect(output).toContainEqual({ meta: {}, name: `child-route-0`, path: `/child-path-0`, component: {} })
            expect(output).toContainEqual({ meta: {}, name: `child-route-1`, path: `/child-path-1`, component: {} })
            expect(output).toContainEqual({ meta: {}, name: `child-route-2`, path: `/child-path-2`, component: {} })
        })

        describe('shared data is merged and', () => {
            const makeFullIteration = (node: RouteNode) => {
                for (let c of node) {}

                return node;
            }

            it('merges paths', () => {
                const createNodeWithChild = (parentPath: string, childPath: string) => (
                    new RouteNode({
                        shared: { basePath: parentPath },
                        children: [
                            new RouteNode({ shared: { basePath: childPath } })
                        ]
                    })
                )
                const node_1 = makeFullIteration(createNodeWithChild('/base', 'child'))
                const node_2 = makeFullIteration(createNodeWithChild('/base', '/child'))
                const node_3 = makeFullIteration(createNodeWithChild('/base/', '/child'))
                const node_4 = makeFullIteration(createNodeWithChild('/base/', 'child'))
                const expectedPath = '/base/child'

                expect(node_1.children[0].shared.basePath).toBe(expectedPath)
                expect(node_2.children[0].shared.basePath).toBe(expectedPath)
                expect(node_3.children[0].shared.basePath).toBe(expectedPath)
                expect(node_4.children[0].shared.basePath).toBe(expectedPath)
            })

            it('merges meta', () => {
                const createNodeWithChild = (parentMeta?: Meta, childMeta?: Meta) => (
                    new RouteNode({
                        shared: { meta: parentMeta },
                        children: [
                            new RouteNode({ shared: { meta: childMeta } })
                        ]
                    })
                )
                const node_1 = createNodeWithChild({ someData: 'data' })
                const node_2 = createNodeWithChild({ parentData: 'data' }, { childData: 'data' })
                const node_3 = createNodeWithChild(undefined, { childData: 'data' })

                makeFullIteration(node_1)
                makeFullIteration(node_2)
                makeFullIteration(node_3)

                expect(node_1.children[0].shared.meta).toEqual({ someData: 'data' })
                expect(node_2.children[0].shared.meta).toEqual({ childData: 'data' })
                expect(node_3.children[0].shared.meta).toEqual({ childData: 'data' })
            })

            it('merges only once if iterated mutliple times', () => {
                const node = new RouteNode({
                    shared: { basePath: '/base' },
                    children: [
                        new RouteNode({ shared: { basePath: '/child' } })
                    ]
                })
                makeFullIteration(node)
                makeFullIteration(node)
                makeFullIteration(node)

                expect(node.children[0].shared.basePath).toBe('/base/child')
            })
        })
    })
})
