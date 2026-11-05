type GbzInterpolationParams = Record<string, unknown>;
type GbzInterpolationFunction = (msgCode:string, msgParams?: Record<string, unknown>) => string;

type MtzTranslationId = string;
type GbzTranslationTable = Record<MtzTranslationId, string>;

type GbzLanguageCode = string;
type GbzTranslationCatalog = Record<GbzLanguageCode, GbzTranslationTable>;

const defaultLang: GbzLanguageCode = 'en';

type GbzTranslationFunction = (
  translationCatalog: GbzTranslationCatalog,
  lang: GbzLanguageCode,
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

const translate: GbzTranslationFunction = (
  translationCatalog: GbzTranslationCatalog,
  lang: GbzLanguageCode,
  msgId:MtzTranslationId,
  msgParams?: Record<string, unknown>
) => {
  let translationTable = translationCatalog[lang];
  if (translationTable === undefined)
    translationTable = translationCatalog[defaultLang];
  let msgStr = translationTable[msgId];
  if (msgStr === undefined && lang !== defaultLang)
    msgStr = translationTable[defaultLang];
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

class TranslatableText {
  private readonly _translationId: MtzTranslationId;

  constructor(translationId: MtzTranslationId) {
    this._translationId = translationId;
  }

  get translationId () {
    return this._translationId;
  }

  translate(lang: GbzLanguageCode, msgParams?: Record<string, unknown>): string {
    if (globalTranslationCatalog === undefined)
      throw new Error("Translation catalog not initialized");
    return translate(globalTranslationCatalog, lang, this._translationId, msgParams);
  }
}

export {
  interpolateString,
  translate,
  mergeTranslationCatalog, globalTranslationCatalog,
  TranslatableText,
};

export type {
  GbzInterpolationFunction,
  GbzInterpolationParams,
  GbzTranslationCatalog
};
