type GbzInterpolationParams = Record<string, unknown>;
type GbzInterpolationFunction = (msgCode:string, msgParams?: Record<string, unknown>) => string;

type GbzMessageId = string;
type GbzTranslationTable = Record<GbzMessageId, string>;

type GbzLanguageCode = string;
type GbzTranslationCatalog = Record<GbzLanguageCode, GbzTranslationTable>;

const defaultLang: GbzLanguageCode = 'en';

type GbzTranslationFunction = (
  translationCatalog: GbzTranslationCatalog,
  lang: GbzLanguageCode,
  msgId:GbzMessageId,
  msgParams?: Record<string, unknown>
) => string;

const interpolateMessage: GbzInterpolationFunction = (message: string, params?: GbzInterpolationParams): string => {
  if (params !== undefined) {
    Object.entries(params).forEach( ([key, value]) => {
      if (value === undefined || value === null)
        value = '?';
      message = message.replaceAll(`{{${key}}}`, String(value));
    });
  }
  return message;
};

const translateMessage: GbzTranslationFunction = (
  translationCatalog: GbzTranslationCatalog,
  lang: GbzLanguageCode,
  msgId:GbzMessageId,
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
  return interpolateMessage(msgStr, msgParams);
};

export { interpolateMessage, translateMessage };
export type { GbzInterpolationFunction, GbzInterpolationParams };
