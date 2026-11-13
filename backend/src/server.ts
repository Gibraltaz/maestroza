import express from 'express';
import type { Request, Response, NextFunction, RequestHandler } from 'express';
import parser from 'accept-language-parser';

import type { GbzLanguageCode } from '@maestroza/translation';
import type { MaestrozaPlatform } from '@maestroza/platform';

import type { Config } from './config.js';

import { declareApiRoutes, createApiContext } from './api.js';
import type {
    MtzApiContext,
  MtzApiContextSendResponseFunction,
  MtzApiMethod,
  MtzApiRouteCallback,
  MtzDeclareRouteFunction,
} from './api.js';

const initializeApiContextMiddleware = (request: Request, response: Response, next: NextFunction) => {

  const acceptedLanguages: Array<GbzLanguageCode> = parser
      .parse( request.headers['accept-language'])
      .map( language => language.code.split('-')[0] ?? '');

  const sendResponseFunction: MtzApiContextSendResponseFunction = (data: unknown, status: number) => {
    response.status(status).json(data);
  };

  request.mtzApiContext = createApiContext(sendResponseFunction, acceptedLanguages);
  next();
};


const startServer = (config: Config, _platform: MaestrozaPlatform, _verbose = false): Promise<void> => {

  return new Promise( (resolve, reject): void => {

    const port = config.server.port;
    const app = express();
    app.use(express.json());
    app.use(initializeApiContextMiddleware);

    /**
     * Cette fonction permet de déclarer au niveau de Express une route en fonction de sa méthode HTTP.
     * Elle associe le chemin de la route à une fonction callback Express qui se charge de
     * rappeler la véritable fonction associée à la route en lui passant le contexte de la requête
     */
    const declareExpressRouteFunction:MtzDeclareRouteFunction = (
      routeMethod: MtzApiMethod,
      routePath: string,
      routeCallback: MtzApiRouteCallback
    ) => {

      // find Express function wrapper to declare route
      const expressRouteDeclarationFunctions = {
        GET:    (path: string, callback: RequestHandler) => app.get(path, callback),
        POST:   (path: string, callback: RequestHandler) => app.post(path, callback),
        PUT:    (path: string, callback: RequestHandler) => app.put(path, callback),
        DELETE: (path: string, callback: RequestHandler) => app.delete(path, callback)
      };
      let expressRouteDeclarationFunction = expressRouteDeclarationFunctions[routeMethod];
      if (expressRouteDeclarationFunction === undefined)
        throw new Error(`Invalid API method «${routeMethod}»`);

      // declare route
      expressRouteDeclarationFunction(routePath, (request: Request, _response: Response, _nextFunction: NextFunction) => {
        // FIXME le contexte ne peut-il pas être créé ici plutôt que dans une middleware Express ?
        const apiContext: MtzApiContext = request.mtzApiContext;
        routeCallback(apiContext);
      });
    };

    declareApiRoutes(declareExpressRouteFunction);

    // FIXME à supprimer ou à mettre au catalogue ?
    app.get('/', (_request: Request, response: Response, _nextFunction: NextFunction) => {
        response.json({
            name: config.general.name,
            description: config.general.description,
        });
    });

    const httpServer = app.listen(port);

    httpServer.once('listening', () => {
      console.log(
        `${config.general.description} is listening on port ${port}`
      );
      resolve();
    });

    httpServer.on('error', (error: NodeJS.ErrnoException) => {
      if (error.code === 'EADDRINUSE') {
        reject(new Error(`Port ${port} is already in use`, {cause: error}));
      } else {
        reject(error);
      }
    });
  });

}

export { startServer };
