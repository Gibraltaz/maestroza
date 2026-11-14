import { translate } from '@maestroza/translation';

import type { MtzApiContext, MtzApiHandler, MtzApiRouteGroup } from "../../api.js";

/**
 * Cette fonction est associée à la route GET «/api/v1/util/lang».
 * Elle est utilisée par les auto-tests pour vérifier l'interprétation du
 * paramètre HTTP «accept-language».
 * Elle renvoie la traduction du nom de la langue sélectionnée parmi celles
 * acceptées par le client.
 */
const langGetRouteHandler: MtzApiHandler = async (context: MtzApiContext): Promise<any> => {
  return {
    lang: translate(context.acceptedLanguages, 'lang')
  };
};

/**
 *  Cette fonction est associée aux routes GET et POST «/api/v1/util/echo».
 *  Elle renvoie juste ce qu'elle a reçu en propriété «received».
 *  Elle est utilisée par les auto-tests pour vérifier le passage de paramètres
 *  pour les requêtes GET et POST.
 */

const echoRouteHandler: MtzApiHandler = async (context: MtzApiContext): Promise<any> => {
  return {
    received: context.parameters
  };
};


const routeGroup: MtzApiRouteGroup = {
  path: 'util',
  routes: [
    {
      path: 'lang',
      method: 'GET',
      handler: langGetRouteHandler
    },
    {
      path: 'echo',
      method: 'GET',
      handler: echoRouteHandler
    },
    {
      path: 'echo',
      method: 'POST',
      handler: echoRouteHandler
    },
  ] 
};

export default routeGroup;

