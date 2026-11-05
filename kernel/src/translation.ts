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

export { interpolateString, translate };
export type { GbzInterpolationFunction, GbzInterpolationParams };
