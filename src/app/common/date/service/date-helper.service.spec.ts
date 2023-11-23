import { DateHelperService } from './date-helper.service';

describe('DateHelperService', () => {
    let service: DateHelperService;

    beforeEach(() => {
        service = new DateHelperService();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('areUTCDatesEqual', () => {
        it('should return true for equal dates', () => {
            const date1 = new Date('2023-01-01T12:00:00Z');
            const date2 = new Date('2023-01-01T12:00:00Z');
            expect(service.areUTCDatesEqual(date1, date2)).toBe(true);
        });

        it('should return true for equal dates', () => {
            const date1 = new Date('2023-01-25T00:00:00+01:00');
            const date2 = new Date('2023-01-24T00:00:00Z');
            expect(service.areUTCDatesEqual(date1, date2)).toBe(true);
        });

        it('should return false for different dates', () => {
            const date1 = new Date('2023-01-01T12:00:00Z');
            const date2 = new Date('2023-01-02T12:00:00Z');
            expect(service.areUTCDatesEqual(date1, date2)).toBe(false);
        });
    });

    describe('areUTCTimesEqual', () => {
        it('should return true for equal times', () => {
            const date1 = new Date('2023-01-01T12:34:56Z');
            const date2 = new Date('2023-01-01T12:34:56Z');
            expect(service.areUTCTimesEqual(date1, date2)).toBe(true);
        });

        it('should return true for equal times', () => {
            const date1 = new Date('2023-01-01T12:34:56Z');
            const date2 = new Date('2023-01-01T14:34:56+02:00');
            expect(service.areUTCTimesEqual(date1, date2)).toBe(true);
        });

        it('should return false for different times', () => {
            const date1 = new Date('2023-01-01T12:34:56Z');
            const date2 = new Date('2023-01-01T13:34:56Z');
            expect(service.areUTCTimesEqual(date1, date2)).toBe(false);
        });
    });

    describe('areUTCDatesAndTimesEqual', () => {
        it('should return true for equal dates and times', () => {
            const date1 = new Date('2023-01-01T12:34:56Z');
            const date2 = new Date('2023-01-01T12:34:56Z');
            expect(service.areUTCDatesAndTimesEqual(date1, date2)).toBe(true);
        });

        it('should return false for different dates', () => {
            const date1 = new Date('2023-01-01T12:34:56Z');
            const date2 = new Date('2023-01-02T12:34:56Z');
            expect(service.areUTCDatesAndTimesEqual(date1, date2)).toBe(false);
        });

        it('should return false for different times', () => {
            const date1 = new Date('2023-01-01T12:34:56Z');
            const date2 = new Date('2023-01-01T13:34:56Z');
            expect(service.areUTCDatesAndTimesEqual(date1, date2)).toBe(false);
        });
    });

    describe('getInvariantDateWithoutTimeZone', () => {
        it('should return UTC date for a valid date', () => {
            const inputDate = new Date('2023-01-01T12:34:56Z');
            const result = service.getInvariantDateWithoutTimeZone(inputDate);

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
            const result = service.getInvariantDateWithoutTimeZone(inputDate);

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
            const result = service.getInvariantDateWithoutTimeZone(inputDate);
            expect(isNaN(result.getTime())).toBe(true);
        });
    });

    describe('getInvarianteCurrentDateWithoutTimeZone', () => {
        it('should return the current date without timezone information', () => {
            const currentDate = new Date();
            const result = service.getInvarianteCurrentDateWithoutTimeZone();

            // Vérifier que l'année, le mois et le jour correspondent
            expect(result.getUTCFullYear()).toBe(currentDate.getUTCFullYear());
            expect(result.getUTCMonth()).toBe(currentDate.getUTCMonth());
            expect(result.getUTCDate()).toBe(currentDate.getUTCDate());
        
            // Vérifier que l'heure, les minutes, les secondes et les millisecondes sont à zéro
            expect(result.getUTCHours()).toBe(0);
            expect(result.getUTCMinutes()).toBe(0);
            expect(result.getUTCSeconds()).toBe(0);
            expect(result.getUTCMilliseconds()).toBe(0);
        });
      });
});