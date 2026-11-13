import type { MtzApiCatalog, MtzApiHandler, MtzApiContext  } from './api.ts';
import { translate } from '@maestroza/translation';

const langRouteHandler: MtzApiHandler = async (context: MtzApiContext): Promise<any> => {
  return {
    lang: translate(context.acceptedLanguages, 'lang')
  };
};

const apiV1: MtzApiCatalog = {
  version: 1,
  routes: [
    {
      path: 'lang',
      method: 'GET',
      handler: langRouteHandler
    },
    /*
    {
      path: 'person',
      routes: [
        {
          path: 'create',
          method: 'POST',
          handler: personCreateRouteHandler 
        },
        {
          path: 'update',
          method: 'POST',
          handler: personUpdateRouteHandler 
        },
        {
          path: 'delete',
          method: 'DELETE',
          handler: personDeleteRouteHandler 
        },

      ]
    }
    */
  ]
};

export { apiV1 };
