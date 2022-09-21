/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect } from 'chai';
import {
  ValidationError,
  validateAdd,
  validateRetrieve,
  NOT_A_STRING,
  NOT_A_NUMBER,
  REGEX_FAIL,
  INCORRECT_LENGTH,
} from './middleware';

describe('Middlewares', function () {
  describe('validateAdd', function () {
    it('should pass when req.body contains sequence "ACTG"', function () {
      const req = {
        body: {
          sequence: 'ACTG',
        },
      } as any;

      // eslint-disable-next-line @typescript-eslint/no-empty-function
      expect(() => validateAdd(req, {} as any, () => {})).to.not.throw;
    });

    it('should throw if sequence is number', function () {
      const req = {
        body: {
          sequence: 345,
        },
      } as any;

      // eslint-disable-next-line @typescript-eslint/no-empty-function
      expect(() => validateAdd(req, {} as any, () => {})).to.throws(ValidationError, NOT_A_STRING);
    });

    it('should throw if sequence has length 0', function () {
      const req = {
        body: {
          sequence: '',
        },
      } as any;

      // eslint-disable-next-line @typescript-eslint/no-empty-function
      expect(() => validateAdd(req, {} as any, () => {})).to.throws(
        ValidationError,
        INCORRECT_LENGTH
      );
    });

    it('should throw if sequence has length 256', function () {
      const req = {
        body: {
          sequence: 'ACTG'.repeat(64),
        },
      } as any;

      // eslint-disable-next-line @typescript-eslint/no-empty-function
      expect(() => validateAdd(req, {} as any, () => {})).to.throws(
        ValidationError,
        INCORRECT_LENGTH
      );
    });

    it('should throw if sequence is lowercase', function () {
      const req = {
        body: {
          sequence: 'actg',
        },
      } as any;

      // eslint-disable-next-line @typescript-eslint/no-empty-function
      expect(() => validateAdd(req, {} as any, () => {})).to.throws(ValidationError, REGEX_FAIL);
    });
  });

  describe('validateRetrieve', function () {
    it('should not throw when req.query.sequence is "ACTG"', function () {
      const req = {
        query: {
          sequence: 'ACTG',
        },
      } as any;

      // eslint-disable-next-line @typescript-eslint/no-empty-function
      expect(() => validateRetrieve(req, {} as any, () => {})).to.not.throw;
    });

    it('should not throw when req.query.levenstein is 2', function () {
      const req = {
        query: {
          sequence: 'ACTG',
          levenstein: 2,
        },
      } as any;

      // eslint-disable-next-line @typescript-eslint/no-empty-function
      expect(() => validateRetrieve(req, {} as any, () => {})).to.not.throw;
    });

    it('should throw when levenstein distance is not a number', function () {
      const req = {
        query: {
          sequence: 'ACTG',
          levenstein: 'not_a_number',
        },
      } as any;

      // eslint-disable-next-line @typescript-eslint/no-empty-function
      expect(() => validateRetrieve(req, {} as any, () => {})).to.throws(
        ValidationError,
        NOT_A_NUMBER
      );
    });
  });
});
