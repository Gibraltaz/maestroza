import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import parser from 'accept-language-parser';

import { translate } from '@maestroza/translation';

import { MtzApiContext } from './ApiContext.js';
import type { MtzApiContextSendResponseFunction } from './ApiContext.js';
import type { GbzLanguageCode } from '@maestroza/translation';
import type { Config } from './config.js';
import type { MaestrozaPlatform } from '@maestroza/platform';

const initializeApiContextMiddleware = (request: Request, response: Response, next: NextFunction) => {

  const acceptedLanguages: Array<GbzLanguageCode> = parser
      .parse( request.headers['accept-language'])
      //.map( language => language.code.split('-')[0] ?? '');
      .map( language => language.code.split('-')[0] ?? '');

  const sendResponseFunction: MtzApiContextSendResponseFunction = (data: unknown, status: number):void => {
    response.status(status).json(data);
  };

  request.mtzApiContext = new MtzApiContext(sendResponseFunction, acceptedLanguages);
  next();
};


const startServer = (config: Config, _platform: MaestrozaPlatform, _verbose = false): Promise<void> => {


  return new Promise( (resolve, reject): void => {

    const port = config.server.port;
    const app = express();
    app.use(express.json());
    app.use(initializeApiContextMiddleware);

    app.get('/', (_request: Request, response: Response, _nextFunction: NextFunction) => {
        response.json({
            name: config.general.name,
            description: config.general.description,
        });
    });

    app.get('/api/v1/lang', (request: Request, _response: Response, _nextFunction: NextFunction) => {
      const context:MtzApiContext = request.mtzApiContext;
      context.sendData({
        acceptedLanguages: context.acceptedLanguages,
        lang: translate(context.acceptedLanguages, 'lang')
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
