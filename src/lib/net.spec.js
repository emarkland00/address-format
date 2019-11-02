import { normalizePort } from './net';

describe('#net', () => {
    describe('normalizePort', () => {
        it('returns the port value if the input is a valid positive integer', done => {
            const validPositivePortNumber = 80;
            const result = normalizePort(validPositivePortNumber);
            expect(result).toBe(validPositivePortNumber);
            done();
        });

        it('returns the string if the port value is a valid named port', done => {
            const validNamedPipe = 'my_pipe';
            const result = normalizePort(validNamedPipe);
            expect(result).toBe(validNamedPipe);
            done();
        });

        it('returns null if port value is negative', done => {
            const negativePortValue = -80;
            const result = normalizePort(negativePortValue);
            expect(result).toBe(null);
            done();
        });

        it('returns null if port value is an empty string', done => {
            const emptyString = '';
            const result = normalizePort(emptyString);
            expect(result).toBe(null);
            done();
        });

        it('returns null if the port value is null', done => {
            const nullInput = null;
            const result = normalizePort(nullInput);
            expect(result).toBe(null);
            done();
        });

        it('returns null if the type of input is not a number or string', done => {
            const invalidInputValue = { some_random_value: 'test' };
            const result = normalizePort(invalidInputValue);
            expect(result).toBe(null);
            done();
        });
    });
});
