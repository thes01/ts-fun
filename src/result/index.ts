export interface Ok<T> {
	success: true;
	data: T;
}

export interface Err<E> {
	success: false;
	error: E;
}

export type Result<T, E> = Ok<T> | Err<E>;

export function ok<T>(data: T): Ok<T> {
    return {
        success: true,
        data,
    };
}

export function err<E>(error: E): Err<E> {
    return {
        success: false,
        error,
    };
}