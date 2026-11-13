import type MtzApiContext from './api.js';

// ajouter la propriété mtzApiContext à l'interface de Express.Request
declare global {
    namespace Express {
        interface Request {
            mtzApiContext: MtzApiContext;
        }
    }
}

export {};
