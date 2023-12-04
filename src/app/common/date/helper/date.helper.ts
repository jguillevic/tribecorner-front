export abstract class DateHelper {
  public constructor() { }

  public static areUTCDatesEqual(date1: Date, date2: Date): boolean {
    return date1.getUTCDate() === date2.getUTCDate() &&
    date1.getUTCMonth() === date2.getUTCMonth() &&
    date1.getUTCFullYear() === date2.getUTCFullYear();
  }

  public static areUTCTimesEqual(date1: Date, date2: Date): boolean {
    return date1.getUTCHours() === date2.getUTCHours() &&
    date1.getUTCMinutes() === date2.getUTCMinutes() &&
    date1.getUTCSeconds() === date2.getUTCSeconds() &&
    date1.getUTCMilliseconds() === date2.getUTCMilliseconds();
  }

  public static areUTCDatesAndTimesEqual(date1: Date, date2: Date): boolean {
    return DateHelper.areUTCDatesEqual(date1, date2) &&
    DateHelper.areUTCTimesEqual(date1, date2);
  }

  public static getUTCDate(date: Date): Date {
    const utcDate = Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      0,
      0,
      0,
      0
    );
    
    return new Date(utcDate);
  }

  public static getInvariantDate(date: Date): Date {
    const utcDate = Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      0,
      0,
      0,
      0
    );
    
    return new Date(utcDate);
  }

  public static getInvariantCurrentDate(): Date {
    const date = new Date();
    return DateHelper.getInvariantDate(date);
  }

  public static getInvariantDateTime(dateTime: Date): Date {
    const utcDate = Date.UTC(
      dateTime.getFullYear(),
      dateTime.getMonth(),
      dateTime.getDate(),
      dateTime.getHours(),
      dateTime.getMinutes(),
      dateTime.getSeconds(),
      dateTime.getMilliseconds()
    );
    
    return new Date(utcDate);
  }

  public static getInvariantCurrentDateTime(): Date {
    const currentDateTime = new Date();
    return DateHelper.getInvariantDateTime(currentDateTime);
  }

  public static getUTCISOStr(date: Date): string {
    return [
      date.getUTCFullYear(),
      (date.getUTCMonth() + 1).toString().padStart(2, '0'),
      date.getUTCDate().toString().padStart(2, '0'),
    ].join('-');
  }

  public static getUTCStr(date: Date): string {
    return [
      date.getUTCDate().toString().padStart(2, '0'),
      (date.getUTCMonth() + 1).toString().padStart(2, '0'),
      date.getUTCFullYear()
    ].join('/');
  }

  public static getUTCHoursAndMinutesStr(date: Date): string {
    return [
      date.getUTCHours().toString().padStart(2, '0'),
      date.getUTCMinutes().toString().padStart(2, '0')
    ].join(':');
  }
}
