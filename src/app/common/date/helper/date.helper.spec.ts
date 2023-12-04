import { DateHelper } from "./date.helper";

describe('DateHelper', () => {
    test('areDatesEqual should compare two equal dates', () => {
      const date1 = new Date('2023-01-01T12:00:00');
      const date2 = new Date('2023-01-01T15:30:00');
      expect(DateHelper.areDatesEqual(date1, date2)).toBe(true);
    });
  
    test('areDatesEqual should compare two different dates', () => {
      const date1 = new Date('2023-01-01T12:00:00');
      const date2 = new Date('2023-01-02T12:00:00');
      expect(DateHelper.areDatesEqual(date1, date2)).toBe(false);
    });
  
    test('getDate should set time to midnight', () => {
      const dateTime = new Date('2023-01-01T15:30:00Z');
      const result = DateHelper.getDate(dateTime);
      expect(result.getHours()).toBe(0);
      expect(result.getMinutes()).toBe(0);
      expect(result.getSeconds()).toBe(0);
      expect(result.getMilliseconds()).toBe(0);
    });
  
    test('getCurrentDate should return current date with time set to midnight', () => {
      const currentDate = Date.now();
      const result = DateHelper.getCurrentDate();
      expect(result.getHours()).toBe(0);
      expect(result.getMinutes()).toBe(0);
      expect(result.getSeconds()).toBe(0);
      expect(result.getMilliseconds()).toBe(0);
      expect(result.getTime()).toBeLessThanOrEqual(currentDate);
    });
  
    test('toISOUTCDate should convert date to ISO string in UTC', () => {
      const date = new Date('2023-01-01T15:30:00Z');
      const result = DateHelper.toISOUTCDate(date);
      expect(result).toBe('2023-01-01');
    });
  
    test('toISODate should convert date to ISO string', () => {
      const date = new Date('2023-01-01T15:30:00Z');
      const result = DateHelper.toISODate(date);
      expect(result).toBe('2023-01-01');
    });
  
    test('toISOUTCTime should convert date to ISO time in UTC', () => {
      const date = new Date('2023-01-01T15:30:00Z');
      const result = DateHelper.toISOUTCTime(date);
      expect(result).toBe('15:30:00');
    });
  
    test('toISOUTC should convert date to full ISO string in UTC', () => {
      const date = new Date('2023-01-01T15:30:00Z');
      const result = DateHelper.toISOUTC(date);
      expect(result).toBe('2023-01-01T15:30:00Z');
    });
  
    test('toDate should convert date to formatted string', () => {
      const date = new Date('2023-01-01T15:30:00Z');
      const result = DateHelper.toDate(date);
      expect(result).toBe('01/01/2023');
    });
  
    test('toHoursAndMinutes should convert date to formatted time string', () => {
      const date = new Date('2023-01-01T15:30:00');
      const result = DateHelper.toHoursAndMinutes(date);
      expect(result).toBe('15:30');
    });
  });