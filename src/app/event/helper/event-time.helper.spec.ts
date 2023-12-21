import { EventTimeHelper } from './event-time.helper';

describe('EventTimeHelper', () => {
  it('should generate an array of times with 15-minute intervals for a 24-hour day', () => {
    const times = EventTimeHelper.getTimes();

    expect(times.length).toEqual(24 * 4); // 24 hours * 4 intervals/hour
    expect(times[0]).toEqual(0);
    expect(times[times.length - 1]).toEqual(23 * 60 + 45); // Last interval of the day
  });

  it('should get the default time based on the current date', () => {
    const currentDate = new Date();
    const expectedTime = currentDate.getHours() * 60 + Math.floor(currentDate.getMinutes() / 15) * 15;

    const defaultTime = EventTimeHelper.getDefaultTime();

    expect(defaultTime).toEqual(expectedTime);
  });

  it('should get the default starting time, which is the same as the default time', () => {
    const defaultTime = EventTimeHelper.getDefaultTime();
    const defaultStartingTime = EventTimeHelper.getDefaultStartingTime();

    expect(defaultStartingTime).toEqual(defaultTime);
  });

  it('should get the default ending time, which is 60 minutes after the default starting time', () => {
    const defaultStartingTime = EventTimeHelper.getDefaultStartingTime();
    const defaultEndingTime = EventTimeHelper.getDefaultEndingTime();

    expect(defaultEndingTime).toEqual(defaultStartingTime + 60);
  });
});