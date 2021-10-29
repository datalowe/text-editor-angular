// https://stackoverflow.com/questions/31626231/custom-error-class-in-typescript
export class InvalidEmailError extends Error {
    constructor(msg: string) {
        super(msg);
        Object.setPrototypeOf(this, InvalidEmailError.prototype);
    }
}

export class MissingTokenError extends Error {
    constructor(msg: string) {
        super(msg);
        Object.setPrototypeOf(this, MissingTokenError.prototype);
    }
}

export class RequestFailedError extends Error {
    constructor(msg: string) {
        super(msg);
        Object.setPrototypeOf(this, RequestFailedError.prototype);
    }
}