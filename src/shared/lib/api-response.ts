export type ApiSuccess<T> = {
   success: true;
   data: T;
   message?: string;
};

export type ApiFailure = {
   success: false;
   message: string;
   code?: string;
};

export function ok<T>(data: T, message?: string): ApiSuccess<T> {
   return { success: true, data, message };
}

export function fail(message: string, code?: string): ApiFailure {
   return { success: false, message, code };
}
