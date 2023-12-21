export abstract class EventTimeHelper {
    public static getTimes(): number[] {
        const times: number[] = [];

        for (let i: number = 0; i < 24; i++) {
            for (let j: number = 0; j < 4; j++) {
                times.push(i * 60 + j * 15);
            }
        }

        return times;
    }

    public static getDefaultTime(): number {
        let time: number = 0;
        const currentDate = new Date();

        // Récupération des heures.
        time += currentDate.getHours() * 60;
        // Récupération des minutes.
        time += Math.floor(currentDate.getMinutes() / 15) * 15;

        return time;
    }

    public static getDefaultStartingTime(): number {
        return EventTimeHelper.getDefaultTime();
    }

    public static getDefaultEndingTime(): number {
        return EventTimeHelper.getDefaultStartingTime() + 60;
    }
}