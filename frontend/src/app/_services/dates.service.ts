import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DatesService {

  constructor() { }

  // Non-Consecutive Dates
  formatNonConsecutiveDates(dates: string[]): string[] {
    const formattedDates: string[] = [];
    const parsedDates = dates.map(date => new Date(date));
    parsedDates.sort((a, b) => a.getTime() - b.getTime());

    let currentMonth = parsedDates[0].getMonth();
    let currentYear = parsedDates[0].getFullYear();
    let monthGroup: string[] = [];

    parsedDates.forEach((date, index) => {
      const day = date.getDate();
      const month = date.getMonth();
      const year = date.getFullYear();

      if (month !== currentMonth || year !== currentYear) {
        formattedDates.push(`${monthGroup.join(';')}/${currentMonth + 1}/${currentYear}`);
        monthGroup = [];
        currentMonth = month;
        currentYear = year;
      }

      monthGroup.push(day.toString());

      if (index === parsedDates.length - 1) {
        formattedDates.push(`${monthGroup.join(';')}/${currentMonth + 1}/${currentYear}`);
      }
    });

    return formattedDates;
  }

  // Consecutives Dates
  formatConsecutiveDates(dates: string[]): string {
    if (dates.length === 0) return '';

    // Convertir les chaînes en objets Date
    const dateObjects = dates.map(date => new Date(date));

    // Trier les dates
    dateObjects.sort((a, b) => a.getTime() - b.getTime());

    // Stocker les segments formatés
    let formattedSegments: string[] = [];
    let startDate = dateObjects[0];
    let endDate = dateObjects[0];

    for (let i = 1; i < dateObjects.length; i++) {
      if (dateObjects[i].getTime() === endDate.getTime() + 24 * 60 * 60 * 1000) {
        // Les dates sont consécutives.
        endDate = dateObjects[i];
      } else {
        // Fin de la séquence de dates consécutives
        formattedSegments.push(this.formatDateRange(startDate, endDate));
        startDate = dateObjects[i];
        endDate = dateObjects[i];
      }
    }
    // Ajouter la dernière séquence
    formattedSegments.push(this.formatDateRange(startDate, endDate));

    // Combiner les segments formatés
    return formattedSegments.join(', ');
  }

  private formatDateRange(start: Date, end: Date): string {
    const startDay = start.getDate();
    const startMonth = start.getMonth() + 1;
    const startYear = start.getFullYear();

    const endDay = end.getDate();
    const endMonth = end.getMonth() + 1;
    const endYear = end.getFullYear();

    if (startYear === endYear) {
      if (startMonth === endMonth) {
        // Même mois et même année
        return `du ${startDay} au ${endDay}/${this.pad(startMonth)}/${startYear}`;
      } else {
        // Même année mais mois différent
        return `du ${startDay}/${this.pad(startMonth)} au ${endDay}/${this.pad(endMonth)}/${startYear}`;
      }
    } else {
      // Année différente
      return `du ${startDay}/${this.pad(startMonth)}/${startYear} au ${endDay}/${this.pad(endMonth)}/${endYear}`;
    }
  }

  private pad(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }
}
