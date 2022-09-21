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
export const NOT_A_NUMBER = 'Levenstein distance is not a number';

const sequenceRegExp = new RegExp('^[ACTG]+$');

const validateSequence = (sequence: unknown) => {
  if (typeof sequence !== 'string') throw new ValidationError(NOT_A_STRING);

  const sequenceLength = sequence.length;
  if (sequenceLength <= 0 || sequenceLength > 255) throw new ValidationError(INCORRECT_LENGTH);

  if (!sequenceRegExp.test(sequence)) {
    throw new ValidationError(REGEX_FAIL);
  }
};

export const validateAdd = (req: Request, _res: Response, next: NextFunction) => {
  validateSequence(req.body.sequence);

  next();
};

export const validateRetrieve = (req: Request, _res: Response, next: NextFunction) => {
  // validate req.query.sequence
  validateSequence(req.query.sequence);

  // validate req.query.levenshtein
  if (!req.query.levenstein) return next(); // optional

  if (isNaN(parseInt(req.query.levenstein as string, 10))) throw new ValidationError(NOT_A_NUMBER);

  next();
};
