import { DateHelper } from "./date.helper";

describe('DateHelperService', () => {
    describe('areUTCDatesEqual', () => {
        it('should return true for equal dates', () => {
            const date1 = new Date('2023-01-01T12:00:00Z');
            const date2 = new Date('2023-01-01T12:00:00Z');
            expect(DateHelper.areUTCDatesEqual(date1, date2)).toBe(true);
        });

        it('should return true for equal dates', () => {
            const date1 = new Date('2023-01-25T00:00:00+01:00');
            const date2 = new Date('2023-01-24T00:00:00Z');
            expect(DateHelper.areUTCDatesEqual(date1, date2)).toBe(true);
        });

        it('should return false for different dates', () => {
            const date1 = new Date('2023-01-01T12:00:00Z');
            const date2 = new Date('2023-01-02T12:00:00Z');
            expect(DateHelper.areUTCDatesEqual(date1, date2)).toBe(false);
        });
    });

    describe('areUTCTimesEqual', () => {
        it('should return true for equal times', () => {
            const date1 = new Date('2023-01-01T12:34:56Z');
            const date2 = new Date('2023-01-01T12:34:56Z');
            expect(DateHelper.areUTCTimesEqual(date1, date2)).toBe(true);
        });

        it('should return true for equal times', () => {
            const date1 = new Date('2023-01-01T12:34:56Z');
            const date2 = new Date('2023-01-01T14:34:56+02:00');
            expect(DateHelper.areUTCTimesEqual(date1, date2)).toBe(true);
        });

        it('should return false for different times', () => {
            const date1 = new Date('2023-01-01T12:34:56Z');
            const date2 = new Date('2023-01-01T13:34:56Z');
            expect(DateHelper.areUTCTimesEqual(date1, date2)).toBe(false);
        });
    });

    describe('areUTCDatesAndTimesEqual', () => {
        it('should return true for equal dates and times', () => {
            const date1 = new Date('2023-01-01T12:34:56Z');
            const date2 = new Date('2023-01-01T12:34:56Z');
            expect(DateHelper.areUTCDatesAndTimesEqual(date1, date2)).toBe(true);
        });

        it('should return false for different dates', () => {
            const date1 = new Date('2023-01-01T12:34:56Z');
            const date2 = new Date('2023-01-02T12:34:56Z');
            expect(DateHelper.areUTCDatesAndTimesEqual(date1, date2)).toBe(false);
        });

        it('should return false for different times', () => {
            const date1 = new Date('2023-01-01T12:34:56Z');
            const date2 = new Date('2023-01-01T13:34:56Z');
            expect(DateHelper.areUTCDatesAndTimesEqual(date1, date2)).toBe(false);
        });
    });

    describe('getInvariantDateWithoutTimeZone', () => {
        it('should return UTC date for a valid date', () => {
            const inputDate = new Date('2023-01-01T12:34:56Z');
            const result = DateHelper.getInvariantDateWithoutTimeZone(inputDate);

            const expectedYear = 2023;
            const expectedMonth = 0;
            const expectedDay = 1;
            const expectedHours = 0;
            const expectedMinutes = 0;
            const expectedSeconds = 0;

            expect(result.getUTCFullYear()).toBe(expectedYear);
            expect(result.getUTCMonth()).toBe(expectedMonth);
            expect(result.getUTCDate()).toBe(expectedDay);
            expect(result.getUTCHours()).toBe(expectedHours);
            expect(result.getUTCMinutes()).toBe(expectedMinutes);
            expect(result.getUTCSeconds()).toBe(expectedSeconds);
        });

        it('should return UTC date for a date with timezone +03:00', () => {
            const inputDate = new Date('2023-01-15T00:00:00+03:00');
            const result = DateHelper.getInvariantDateWithoutTimeZone(inputDate);

            const expectedYear = 2023;
            const expectedMonth = 0;
            const expectedDay = 14;
            const expectedHours = 0;
            const expectedMinutes = 0;
            const expectedSeconds = 0;
    
            expect(result.getUTCFullYear()).toBe(expectedYear);
            expect(result.getUTCMonth()).toBe(expectedMonth);
            expect(result.getUTCDate()).toBe(expectedDay);
            expect(result.getUTCHours()).toBe(expectedHours);
            expect(result.getUTCMinutes()).toBe(expectedMinutes);
            expect(result.getUTCSeconds()).toBe(expectedSeconds);
        });

        it('should return UTC date for an invalid date', () => {
            const inputDate = new Date('invalid');
            const result = DateHelper.getInvariantDateWithoutTimeZone(inputDate);
            expect(isNaN(result.getTime())).toBe(true);
        });
    });

    describe('getInvariantCurrentDateWithoutTimeZone', () => {
        it('should return the current date without timezone information', () => {
            const currentDate = new Date();
            const result = DateHelper.getInvariantCurrentDateWithoutTimeZone();

            expect(result.getUTCFullYear()).toBe(currentDate.getUTCFullYear());
            expect(result.getUTCMonth()).toBe(currentDate.getUTCMonth());
            expect(result.getUTCDate()).toBe(currentDate.getUTCDate());
            expect(result.getUTCHours()).toBe(0);
            expect(result.getUTCMinutes()).toBe(0);
            expect(result.getUTCSeconds()).toBe(0);
            expect(result.getUTCMilliseconds()).toBe(0);
        });
    });

    describe('toUTCDateWithoutTimeString', () => {
        it('should return a string corresponding to the UTC date without time', () => {
            const date = new Date('2023-12-15T02:35:25+03:00');
            const result = DateHelper.toUTCDateWithoutTimeString(date);

            expect(result).toBe('2023-12-14');
        });
    });
});