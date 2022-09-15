/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect } from 'chai';
import {
    ValidationError,
    validateAdd,
    NOT_A_STRING,
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
            expect(() => validateAdd(req, {} as any, () => {})).to.throws(
                ValidationError,
                NOT_A_STRING
            );
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
            expect(() => validateAdd(req, {} as any, () => {})).to.throws(
                ValidationError,
                REGEX_FAIL
            );
        });
    });
});
