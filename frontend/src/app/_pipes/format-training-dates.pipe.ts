import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatTrainingDates'
})
export class FormatTrainingDatesPipe implements PipeTransform {
  transform(dates: string[]): string {
    const formattedDates: string[] = [];
    let currentPeriod: string[] = [];

    dates.forEach((date, index) => {
      const currentDate = new Date(date);
      const nextDate = index < dates.length - 1 ? new Date(dates[index + 1]) : null;

      if (nextDate && currentDate.getDate() + 1 === nextDate.getDate()) {
        currentPeriod.push(date);
      } else {
        if (currentPeriod.length > 1) {
          formattedDates.push(`${currentPeriod[0]} - ${currentPeriod[currentPeriod.length - 1]}`);
        } else {
          formattedDates.push(currentPeriod[0]);
        }
        currentPeriod = [date];
      }
    });

    return formattedDates.join(' et ');
  }
}
