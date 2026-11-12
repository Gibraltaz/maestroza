import { translate, defaultLang, GbzLanguageCode } from './translation.js';

type MtzErrorCode = string & { __brand : 'err' };


const MtzErrorEnum = {
  INTERNAL_ERROR:   'INTERNAL_ERROR',
  NOT_FOUND:        'NOT_FOUND',
  ALREADY_EXISTS:   'ALREADY_EXISTS',
  INVALID_ARGUMENT: 'INVALID_ARGUMENT',
  UNAUTHORIZED:     'UNAUTHORIZED'
} as const;

type MtzErrorType = (typeof MtzErrorEnum)[keyof typeof MtzErrorEnum];

class MtzTranslatableError extends Error {

  private readonly _msgCode: MtzErrorCode;
  private readonly _msgParams: Record<string, unknown>;
  private readonly _errorType: MtzErrorType;

  constructor(
    msgCode: MtzErrorCode,
    msgParams: Record<string, unknown> = {},
    errorType: MtzErrorType = MtzErrorEnum.INTERNAL_ERROR
  ) {
    super(translate(defaultLang, msgCode, msgParams));
    this.name = "MtzTranslatableError";
    this._msgCode = msgCode;
    this._msgParams = msgParams;
    this._errorType = errorType;
  }

  translate(lang: GbzLanguageCode ) {
    return translate(lang, this._msgCode, this._msgParams);
  }

  get errorType() {
    return this._errorType;
  }
}

export { MtzTranslatableError, MtzErrorEnum }
export type { MtzErrorCode, MtzErrorType }
