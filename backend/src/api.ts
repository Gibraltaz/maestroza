import { MtzErrorEnum, MtzTranslatableError } from '@maestroza/translation';
import type { GbzLanguageCode, MtzErrorCode, MtzErrorType } from '@maestroza/translation';

import { apiV1 } from './api-v1.js';

/**
 * table de conversion entre les types d'erreur d'erreur maestroza
 * et les status HTTP renvoyés par l'API
 */
const errorTypeToHttpStatus : Record<MtzErrorType, number> = {
  [MtzErrorEnum.NOT_FOUND]: 404,
  [MtzErrorEnum.ALREADY_EXISTS]: 500,
  [MtzErrorEnum.INTERNAL_ERROR]: 500,
  [MtzErrorEnum.INVALID_ARGUMENT]: 400,
  [MtzErrorEnum.UNAUTHORIZED]: 401,
}

type MtzApiContextSendResponseFunction = (data: unknown, status: number) => void;

type MtzApiContext = {
  acceptedLanguages: Array<GbzLanguageCode>,
  sendData (data: unknown): Promise<void>,
  sendError (mtzError: MtzTranslatableError): Promise<void>
};

/**
 * Fonction de rappel associée à une route de l'API.
 * Elle reçoit en argument un contexte propre à la requête exécutée.
 * Ce contexte contient par exemple la ou les langues acceptées par le client.
 * La fonction peut :
 * • soit renvoyer des données qui seront retournées dans la propriété «data»
 *   du corps de la réponse au format JSON.
 *   Le status HTTP status vaudra alors 200.
 * • soit générer une erreur  dont le message sera renvoyé dans la propriété «error»
 *   du corps de la réponse au format JSON.
 *   Le status HTTP status sera déterminé en fonction du type de l'erreur.
 *   Pour une erreur MtzTranslatableError, il sera déterminé en fonction du type de l'erreur
 *   et pour tout autre type d'erreur il faudra 500.
 */
type MtzApiHandler = (context: MtzApiContext) => Promise<any>;

type MtzApiMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

type MtzApiRouteDefinition = {
  path: string,
  method: MtzApiMethod,
  handler: MtzApiHandler
};

type MtzApiRouteGroup = {
  path: string,
  routes: Array<MtzApiRouteDefinition>
}

type MtzApiCatalog = {
  version: number,
  routes: Array<MtzApiRouteGroup|MtzApiRouteDefinition>
};

type MtzApiRouteCallback = (context: MtzApiContext) => Promise<void>;
type MtzDeclareRouteFunction = (apiMethod: MtzApiMethod, routePath: string, routeCallback: MtzApiRouteCallback) =>  void;


const createApiContext = (
  sendResponseFunction: MtzApiContextSendResponseFunction,
  acceptedLanguages: Array<GbzLanguageCode>
): MtzApiContext => {

  return {
    acceptedLanguages,

    sendData: async(data: unknown) => {
      const jsonBody = {
        data
        //token, etc
      };
      sendResponseFunction(jsonBody, 200); // FIXME hard coded HTTP status
    },

    sendError: async(mtzError: MtzTranslatableError) => {
      let status = errorTypeToHttpStatus[mtzError.errorType];
      const jsonBody = {
        error: mtzError.translate(acceptedLanguages),
      };
      sendResponseFunction(jsonBody, status);
    }

  }
};


/**
 * Contient le tableau de toutes les versions d'API supportées (actuellement il n'y a que l'API en version V1).
 */
const apiCatalogArray = [ apiV1 ];


/**
 * Déclare toutes les routes de toutes les versions d'API supportées.
 *
 * @param declareRouteFunction : fonction a rappeler pour déclarer la route en fonction de sa méthode
 */
const declareApiRoutes = (declareRouteFunction:MtzDeclareRouteFunction): void => {

  const declareApiRoute = (routeMethod: MtzApiMethod, routePath: string, apiHandler: MtzApiHandler): void => {
    const routeCallback = async (apiContext: MtzApiContext) => {
      try {
        const data = await apiHandler(apiContext);
        await apiContext.sendData(data);
      }
      catch (error: any) {
        const translatableError = (error instanceof MtzTranslatableError) ?
          error
        :
          new MtzTranslatableError(
            'error:unknown' as MtzErrorCode,
            { message: error?.message ?? error },
            MtzErrorEnum.INTERNAL_ERROR
          );

        await apiContext.sendError(translatableError);
      }
    };
    declareRouteFunction(routeMethod, routePath, routeCallback );
  };

  for (const apiCatalog of apiCatalogArray) {
    const apiVersion = apiCatalog.version;
    for (const apiRoute of apiCatalog.routes) {
      //@ts-ignore
      if (apiRoute.handler !== undefined) {
        const apiRouteDefinition = apiRoute as MtzApiRouteDefinition;
        const routePath = `/api/v${apiVersion}/${apiRouteDefinition.path}`;
        const apiHandler = apiRouteDefinition.handler;
        declareApiRoute(apiRouteDefinition.method, routePath, apiHandler);
      }
      else {
        const apiRouteGroup = apiRoute as MtzApiRouteGroup;
        for (const apiSubRoute of apiRouteGroup.routes) {
          const apiSubRouteDefinition = apiSubRoute as MtzApiRouteDefinition;
          const routePath = `/api/v${apiVersion}/${apiRoute.path}/${apiSubRouteDefinition.path}`;
          const apiHandler = apiSubRouteDefinition.handler;
          declareApiRoute(apiSubRouteDefinition.method, routePath, apiHandler);
        }
      }
    }
  }
}

export { declareApiRoutes, createApiContext };

export type {
  MtzApiCatalog,
  MtzApiHandler,
  MtzApiRouteDefinition,
  MtzApiRouteGroup,
  MtzApiMethod,
  MtzApiContext,
  MtzApiRouteCallback,
  MtzDeclareRouteFunction,
  MtzApiContextSendResponseFunction 
};
