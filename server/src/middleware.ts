import { Request, Response, NextFunction } from 'express';

export class ValidationError extends Error {
    constructor(msg: string) {
        super(msg);
        this.name = 'ValidationError';

        Object.setPrototypeOf(this, ValidationError.prototype);
    }
}

export const NOT_A_STRING = 'DNA sequence is not a string';
export const INCORRECT_LENGTH =
    'DNA sequence length cannot be less than 0 and more than 255 characters';
export const REGEX_FAIL = 'DNA sequence does not match ACTG pattern';

const sequenceRegExp = new RegExp('^[ACTG]+$');

export const validateAdd = (req: Request, _res: Response, next: NextFunction) => {
    if (typeof req.body.sequence !== 'string') throw new ValidationError(NOT_A_STRING);

    const sequenceLength = req.body.sequence.length;
    if (sequenceLength <= 0 || sequenceLength > 255) throw new ValidationError(INCORRECT_LENGTH);

    if (!sequenceRegExp.test(req.body.sequence)) {
        throw new ValidationError(REGEX_FAIL);
    }

    next();
};
