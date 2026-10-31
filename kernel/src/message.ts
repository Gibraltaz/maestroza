type GbzInterpolationParams = Record<string, unknown>;
type GbzInterpolationFunction = (msgCode:string, msgParams?: Record<string, unknown>) => string;

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

export { interpolateMessage };
export type { GbzInterpolationFunction, GbzInterpolationParams };
