import { translate, defaultLang, GbzLanguageCode } from './translation.js';

type MtzErrorCode = string & { __brand : 'err' };

class MtzTranslatableError extends Error {

  private readonly _msgCode: MtzErrorCode;
  private readonly _msgParams: Record<string, unknown>;

  constructor(msgCode: MtzErrorCode, msgParams: Record<string, unknown> = {}) {
    super(translate(defaultLang, msgCode, msgParams));
    this.name = "MtzTranslatableError";
    this._msgCode = msgCode;
    this._msgParams = msgParams;
  }

  translate(lang: GbzLanguageCode ) {
    return translate(lang, this._msgCode, this._msgParams);
  }
}

export { MtzTranslatableError }
export type { MtzErrorCode }
