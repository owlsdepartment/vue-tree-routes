# vue-tree-routes
Small library to write Vue routes definition in a tree structure.

To add library to project
```properties
npm install --save @owlsdepartment/vuex-typed

# or if you use yarn

yarn add @owlsdepartment/vuex-typed
```

## Versioning

Vue | Vue Router | Vue Tree Routes
-- | -- | --
^3.0.0 | ^4.0.0 | ^2.0.0
^2.6.0 | ^3.1.6 | ^1.1.1

If you're looking for `README.md` for v2:
 - [2.0.2](https://github.com/owlsdepartment/vue-tree-routes/blob/master/README.md)

## Motivations

Writing routes definitions for Vue Router, you mostly have to keep it all in flat array, even tho you can have `/app/note/list`, `/app/note/add`, `/app/note/:id` and all behave like a children of route `/app/note` but at the same time, all are using the same `<router-view />` component.

This library was created to reflect this logic structure of a tree in our code and, if we want, in our files.

## Usage

Every tree node is instance of class `RouteNode`, that you can create using `createRouteNode`:

```typescript
const node = createRouteNode({ /* data */ }) // Preferred way
```

You can also do it using class itself:

```typescript
const node = new RouteNode({ /* data */ }) // also possible
```

__What's the difference?__

Function `createRouteNode` will accept children array, that don't have to be an instance of class `RouteNode` and will convert them to this class, while `RouteNode` accepts only instances of `RouteNode`.

### Parameters

`createRouteNode` accepts an object of type `RouteDefinition` with fields:

```typescript
interface RouteDefinition {
    shared?: SharedData;
    routes?: RouteRecord[];
    children?: RouteDefinition[];
}
```

#### Parameters - routes

Accepts an array of route definitions. It is exctly the same like `RouteRecordRaw` in `vue-router` with a small change for TypeScript users: field `meta` is typed with `Meta` interface, so you can override it with your own fields.
More on that later.

#### Parameters - children

An array of child nodes. They can be instances of `RouteNode`.

#### Parameters - shared

Object with shared data applied on every route. It has two fields:

```typescript
interface SharedData {
    basePath?: string;
    meta?: Meta;
}
```

- `basePath` - path prefix that will be applied on every route `path` field in `routes` array. Can be with or without starting and ending `/` (`some/path`, `some/path/`, `/some/path` are all accepted). It will be also merged with parent node basePath.

*Example*
```typescript
const parent = createRouteNode({
    shared: { basePath: "parent/path" },
    children: []
})

const child = createRouteNode({
    shared: { basePath: "child/path" }
})
```

Child basePath will be `parent/path/child/path`. If parent also has an ancestor, it will also be added to child base path like: `ancestor/path/parent/path/child/path`.

- `meta` - meta data that will be applied on every route `meta` field in `routes` array only if no `meta` is defined.

*Example*
```typescript
const parent = createRouteNode({
    shared: { meta: { allow: true } },
    routes: [
        { path: "route/1" },                            // meta will be applied
        { path: "route/2", meta: { allow: false } },    // meta won't be applied
    ]
})
```

### Adding to router

As all trees, this also require a root node. Maybe your routes structure has already a root node, but if not, you can use helper `createRoot` that accepts an array of nodes, either of type `RouteDefinition` or `RouteNode`.

```typescript
const root = createRoot([
    projects,
    info,
    home
])
```

Than, to add it to out `vue-router` we simply use spread operator like this:

```typescript
const router = new Router({
    routes: [
        ...root
    ]
})
```

It works because `RouteNode` has implemeneted `Symbol.iterator`.

Alternative without using `root`:

```typescript
const router = new Router({
    routes: [
        ...projects,
        ...info,
        ...home
    ]
})
```

### Overriding `Meta interface` (since v1.0.4)

As mentioned earlier, if you are using TypeScript, you can define some project-specific fields, that are expected in `meta`, by using TypeScript module declaration:

```typescript
import { _Meta } from "@owlsdepartment/vue-tree-routes/dist/types/types";

declare module "@owlsdepartment/vue-tree-routes/dist/types/types" {
    export interface _Meta {
        // your meta declaration
    }
}
```

By default, `Meta` is an object with any keys and any values, but it is extended from `_Meta` interface, thus allowing for declaring custom fields.

## Full example

```typescript
const projects = createRouteNode({
    shared: {
        basePath: "projects", meta: { allowedOnly: "Admin" }
    },
    routes: [
        { name: "add-project", path: "add", component: AddProject },
        { name: "edit-project", path: "edit/:id", component: EditProject },
        { name: "delete-project", path: "delete/:id", component: DeleteProject },
        { name: "all-projects", path: "list", component: ListProjects, meta: {} }
    ]
})

const images = createRouteNode({
    shared: {
        basePath: "images", meta: { allowedOnly: "Admin" }
    },
    routes: [
        { name: "add-image", path: "add", component: AddImage },
        { name: "edit-image", path: "edit/:id", component: EditImage },
        { name: "delete-image", path: "delete/:id", component: DeleteImage },
        { name: "all-images", path: "list", component: ListImages, meta: {} }
    ]
})

const adminHub = createRouteNode({
    shared: {
        basePath: "admin"
    },
    routes: [
        { name: "admin-home", path: "", component: AdminView }
    ],
    children: [projects, images]
})

const home = createRouteNode({
    shared: {
        basePath: ""
    },
    routes: [
        { name: "home", path: "home", component: HomeView }
    ],
    children: [adminHub]
})

const router = new Router({
    // some properties...
    routes: [...home]
})
```

## Project Status

Project is new and maintained. And feedback, questions and issues are appreciated.

## License

Library is under [MIT License](https://opensource.org/licenses/MIT)
