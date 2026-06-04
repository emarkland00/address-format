import { normalizePort } from './net';

describe('#net', () => {
    describe('normalizePort', () => {
        it('returns the port value if the input is a valid positive integer', () => {
            const validPositivePortNumber = 80;
            const result = normalizePort(validPositivePortNumber);
            expect(result).toBe(validPositivePortNumber);
        });

        it('returns the string if the port value is a valid named pipe', () => {
            const validNamedPipe = 'my_pipe';
            const result = normalizePort(validNamedPipe);
            expect(result).toBe(validNamedPipe);
        });

        it('returns null if port value is negative', () => {
            const negativePortValue = -80;
            const result = normalizePort(negativePortValue);
            expect(result).toBe(null);
        });

        it('returns null if port value is an empty string', () => {
            const emptyString = '';
            const result = normalizePort(emptyString);
            expect(result).toBe(null);
        });

        it('returns null if the port value is null', () => {
            const nullInput = null;
            const result = normalizePort(nullInput);
            expect(result).toBe(null);
        });

        it('returns null if the type of input is not a number or string', () => {
            const invalidInputValue = { some_random_value: 'test' };
            const result = normalizePort(invalidInputValue);
            expect(result).toBe(null);
        });
    });
});
