export abstract class DateHelper {
  public static areDatesEqual(date1: Date, date2: Date): boolean {
    return date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear();
  }

  public static getDate(dateTime: Date): Date {
    return new Date(
      dateTime.getFullYear(),
      dateTime.getMonth(),
      dateTime.getDate(),
      0,
      0,
      0,
      0
    );
  }

  public static getCurrentDate(): Date {
    const date = new Date();
    return DateHelper.getDate(date);
  }

  public static toISOUTCDate(date: Date): string {
    return [
      date.getUTCFullYear(),
      (date.getUTCMonth() + 1).toString().padStart(2, '0'),
      date.getUTCDate().toString().padStart(2, '0'),
    ].join('-');
  }

  public static toISODate(date: Date): string {
    return [
      date.getFullYear(),
      (date.getMonth() + 1).toString().padStart(2, '0'),
      date.getDate().toString().padStart(2, '0'),
    ].join('-');
  }

  public static toISOUTCTime(date: Date): string {
    return [
      date.getUTCHours().toString().padStart(2, '0'),
      date.getUTCMinutes().toString().padStart(2, '0'),
      date.getUTCSeconds().toString().padStart(2, '0')
    ].join(':');
  }

  public static toISOUTC(date: Date): string {
    return `${DateHelper.toISOUTCDate(date)}T${DateHelper.toISOUTCTime(date)}Z`;
  }

  public static toDate(date: Date): string {
    return [
      date.getDate().toString().padStart(2, '0'),
      (date.getMonth() + 1).toString().padStart(2, '0'),
      date.getFullYear()
    ].join('/');
  }

  public static toHoursAndMinutes(date: Date): string {
    return [
      date.getHours().toString().padStart(2, '0'),
      date.getMinutes().toString().padStart(2, '0')
    ].join(':');
  }
}