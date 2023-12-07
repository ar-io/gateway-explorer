import { RootRoute, Route, Router, createHashHistory, lazyRouteComponent, Outlet } from "@tanstack/react-router";
import { Root } from "./Root";
import GarLoader from "./components/GarLoader";

const importLazyReports = () => import('./LazyReports')

const importLazyObserve = () => import('./LazyObserve')

// Create a root route
const rootRoute = new RootRoute({
  component: Root,
});

const explorerRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/",
  component: GarLoader,
});

export const hostRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/gateway/$host",
  component: () => <Outlet/>
});

export const hostIndexRoute = new Route({
  getParentRoute: () => hostRoute,
  path: "/",
  component: () => <div>TODO: Host Info</div>
});

export const reportsRoute = new Route({
  getParentRoute: () => hostRoute,
  path: "/reports",
  component: () => <Outlet/>
});

export const reportsIndexRoute = new Route({
  getParentRoute: () => reportsRoute,
  path: "/",
  component: lazyRouteComponent(importLazyReports, "ReportsIndex")
});

export const reportsCurrentRoute = new Route({
  getParentRoute: () => reportsRoute,
  path: "/current",
  component: lazyRouteComponent(importLazyReports, "ReportsCurrent"),
});

export const reportsTxIdRoute = new Route({
  getParentRoute: () => reportsRoute,
  path: "/tx/$txId",
  component: lazyRouteComponent(importLazyReports, "ReportsTxId")
});

export const observeRoute = new Route({
  getParentRoute: () => hostRoute,
  path: "/observe",
  component: () => <Outlet/>
});

export const observeIndexRoute = new Route({
  getParentRoute: () => observeRoute,
  path: "/",
  component: lazyRouteComponent(importLazyObserve, "ObserveIndex")
});

export const rewardsRoute = new Route({
  getParentRoute: () => hostRoute,
  path: "/rewards",
  component: () => <Outlet/>
});

export const rewardsIndexRoute = new Route({
  getParentRoute: () => rewardsRoute,
  path: "/",
  component: () => <div>TODO: Rewards List</div>
});

export const splatRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "*",
  component: () => <div>404 Not Found</div>,
});

// Create the route tree using your routes
const routeTree = rootRoute.addChildren([
  explorerRoute,
  hostRoute.addChildren([
    hostIndexRoute,
    reportsRoute.addChildren([
      reportsIndexRoute,
      reportsCurrentRoute,
      reportsTxIdRoute,
    ]),
    observeRoute.addChildren([
      observeIndexRoute,
    ]),
  ]),
  splatRoute,
]);

// Use Hash History to support arweave gateway
const hashHistory = createHashHistory()

// Create the router using your route tree
export const router = new Router({ routeTree, history: hashHistory });

// Register your router for maximum type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
