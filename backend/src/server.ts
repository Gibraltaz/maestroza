import express from 'express';
import type { Request, Response, NextFunction, RequestHandler } from 'express';
import parser from 'accept-language-parser';

import type { GbzLanguageCode } from '@maestroza/translation';
import type { MaestrozaPlatform } from '@maestroza/platform';

import type { Config } from './config.js';

import { createApiContext, declareApiRoutes } from './api.js';
import type {
  MtzApiContextSendResponseFunction,
  MtzApiMethod,
  MtzApiRouteCallback,
  MtzDeclareRouteFunction,
} from './api.js';

const startServer = (config: Config, _platform: MaestrozaPlatform, _verbose = false): Promise<void> => {

  return new Promise( (resolve, reject): void => {

    const port = config.server.port;
    const app = express();
    app.use(express.json());

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

      /**
       * Cette fonction sert d'intermédiaire entre Express et la fonction de rappel de la route.
       * Elle est déclenchée lorsque la route est appelée et elle appelle la fonction 
       * de traitement associée à la route.
       * Elle passe à cette fonction un contexte lié à la requête qui contient : 
       *   • une fonction permettant de renvoyer le résultat sous forme de données ou erreur
       *     en appelant la fonction de Express qui permet de renvoyer des données au format JSON.
       *   • un tableau contenant la ou les langues acceptées par l'entête HTTP «accepted-language»
       *     de la requête.
       */
      const callback:RequestHandler = (request: Request, response: Response) => {

        const parameters: Record<string, any> = {};

        Object.entries(request.query).forEach(
          ([key, value]) => {
            parameters[key] = value;
          }
        );

        const acceptedLanguages: Array<GbzLanguageCode> = parser
            .parse( request.headers['accept-language'])
            .map( language => language.code.split('-')[0] ?? '');

        const sendResponseFunction: MtzApiContextSendResponseFunction = (data: unknown, status: number) => {
          response.status(status).json(data);
        };

        const apiContext = createApiContext(sendResponseFunction, acceptedLanguages, parameters);

        routeCallback(apiContext);
      }

      // declare route
      expressRouteDeclarationFunction(routePath, callback);

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
