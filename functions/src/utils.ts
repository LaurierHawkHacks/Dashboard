export enum HttpStatus {
    OK = 200,
    CREATED = 201,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    NOT_FOUND = 403,
    INTERNAL_SERVER_ERROR = 500,
}

export function response<T>(
    status: HttpStatus,
    payload?: { message?: string; data?: T }
) {
    return {
        status,
        ...payload,
    };
}
