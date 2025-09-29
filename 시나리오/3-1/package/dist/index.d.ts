import { Router } from 'express';

interface KMonitorOptions {
    pathPrefix?: string;
}
declare function createKMonitorRouter(opts?: KMonitorOptions): {
    path: string;
    router: Router;
};
declare function kMonitor(opts?: KMonitorOptions): Router;
declare const _default: {
    createKMonitorRouter: typeof createKMonitorRouter;
    kMonitor: typeof kMonitor;
};

export { type KMonitorOptions, createKMonitorRouter, _default as default, kMonitor };
