import { MtzTranslatableError, MtzErrorEnum } from '@maestroza/translation';
import type { GbzLanguageCode } from '@maestroza/translation';
import type { MtzErrorType } from '@maestroza/translation';

const errorTypeToHttpStatus : Record<MtzErrorType, number> = {
  [MtzErrorEnum.NOT_FOUND]: 404,
  [MtzErrorEnum.ALREADY_EXISTS]: 500,
  [MtzErrorEnum.INTERNAL_ERROR]: 500,
  [MtzErrorEnum.INVALID_ARGUMENT]: 400,
  [MtzErrorEnum.UNAUTHORIZED]: 401,
}

type MtzApiContextSendResponseFunction = (data: unknown, status: number) => void;


class MtzApiContext {
  private _sendResponseFunction: MtzApiContextSendResponseFunction;
  private _acceptedLanguages: Array<GbzLanguageCode>;

  constructor (sendResponseFunction: MtzApiContextSendResponseFunction, acceptedLanguages: Array<GbzLanguageCode>) {
    this._sendResponseFunction = sendResponseFunction;
    this._acceptedLanguages = [...acceptedLanguages];
  }

  public get acceptedLanguages() {
    return this._acceptedLanguages
  }

  public sendData (data: unknown): void {
    const jsonBody = {
      data
      //token, etc
    };
    this._sendResponseFunction(jsonBody, 200); // FIXME hard coded HTTP status
  }

  public sendError (mtzError: MtzTranslatableError): void {
    let status = errorTypeToHttpStatus[mtzError.errorType];
    const jsonBody = {
      error: mtzError.translate(this._acceptedLanguages),
    };
    this._sendResponseFunction(jsonBody, status);
  }

};

export { MtzApiContext };
export type { MtzApiContextSendResponseFunction };
