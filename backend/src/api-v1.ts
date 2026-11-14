import type { MtzApiCatalog, MtzApiHandler, MtzApiContext  } from './api.ts';

import utilRouteGroup from './routes/util/index.js';


const apiV1: MtzApiCatalog = {
  version: 1,
  routes: [
    utilRouteGroup,
  ]
};

export { apiV1 };
