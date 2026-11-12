type GbzInterpolationParams = Record<string, unknown>;
type GbzInterpolationFunction = (msgCode:string, msgParams?: Record<string, unknown>) => string;

type MtzTranslationId = string;
type GbzTranslationTable = Record<MtzTranslationId, string>;

type GbzLanguageCode = string;
type GbzTranslationCatalog = Record<GbzLanguageCode, GbzTranslationTable>;

const defaultLang: GbzLanguageCode = 'en';

type GbzTranslationFunction = (
  languages: GbzLanguageCode|Array<GbzLanguageCode>,
  msgId:MtzTranslationId,
  msgParams?: Record<string, unknown>
) => string;

const interpolateString: GbzInterpolationFunction = (str: string, params?: GbzInterpolationParams): string => {
  if (params !== undefined) {
    Object.entries(params).forEach( ([key, value]) => {
      if (value === undefined || value === null)
        value = '?';
      str = str.replaceAll(`{{${key}}}`, String(value));
    });
  }
  return str;
};

/**
 * Renvoie la traduction d'un message en recherchant l'ID du message dans le catalogue de traduction passé en paramètre.
 * Le message est recherché dans les tables de traduction associées à la langue ou aux langues passées en paramètre.
 * La table de traduction du langage par défaut est utilisée au final si les message n'a pas été trouvé dans les langues demandées.
 * Si au final, le message n'a toujours pas été trouvé, la fonction renvoie l'ID du message.
 * Le dernier paramètre permet de spécifier les éventuelles valeurs à remplacer dans le message.
 */
const translateFromCatalog = (
  translationCatalog: GbzTranslationCatalog,
  languages: GbzLanguageCode|Array<GbzLanguageCode>,
  msgId:MtzTranslationId,
  msgParams?: Record<string, unknown>
) => {
  const languageArray = Array.isArray(languages) ? [...languages, defaultLang] : [languages, defaultLang];

  let msgStr: string|undefined;
  for (const lang of languageArray) {
    let translationTable = translationCatalog[lang];
    if (translationTable === undefined)
      continue;
    msgStr = translationTable[msgId];
    if (msgStr !== undefined)
      break;
  }
  if (msgStr === undefined)
    msgStr = msgId;
  return interpolateString(msgStr, msgParams);
};


let globalTranslationCatalog: GbzTranslationCatalog;

const mergeTranslationCatalog = (translationCatalog: GbzTranslationCatalog) => {
  if (globalTranslationCatalog === undefined)
    globalTranslationCatalog = {};
  Object.entries(translationCatalog).forEach(([lang, translationTable]) => {
    if (globalTranslationCatalog[lang] === undefined)
      globalTranslationCatalog[lang] = {};
    const targetTranslationTable = globalTranslationCatalog[lang];
    Object.entries(translationTable).forEach(([translationId, translationString]) => {
      targetTranslationTable[translationId] = translationString;
    });
  });
}

const translate: GbzTranslationFunction = (
  languages: GbzLanguageCode | Array<GbzLanguageCode>,
  msgId:MtzTranslationId,
  msgParams?: Record<string, unknown>
) => {

  // Pour les autotests internes, le module n'est pas obligatoirement initialisé.
  // Dans ce cas, on renvoie l'ID du message suivi des paramètres du message.
  if (globalTranslationCatalog === undefined) {
    let msgStr = msgId;
    if (msgParams !== undefined && Object.keys(msgParams).length > 0)
      msgStr += ' (' + Object.entries(msgParams).map(([key, value]) => `${key}=${String(value)}`).join(', ') + ')';
    return msgStr;
  }

  return translateFromCatalog(
    globalTranslationCatalog,
    languages,
    msgId,
    msgParams
  );
};


class TranslatableText {
  private readonly _translationId: MtzTranslationId;

  constructor(translationId: MtzTranslationId) {
    this._translationId = translationId;
  }

  get translationId () {
    return this._translationId;
  }

  translateFromCatalog(languages: GbzLanguageCode|Array<GbzLanguageCode>, msgParams?: Record<string, unknown>): string {
    if (globalTranslationCatalog === undefined)
      throw new Error("Translation catalog not initialized");
    return translateFromCatalog(globalTranslationCatalog, languages, this._translationId, msgParams);
  }
}

export {
  defaultLang,
  interpolateString,
  translateFromCatalog,
  mergeTranslationCatalog,
  translate,
  globalTranslationCatalog,
  TranslatableText,
};

export type {
  GbzLanguageCode,
  GbzInterpolationFunction,
  GbzInterpolationParams,
  GbzTranslationCatalog
};
