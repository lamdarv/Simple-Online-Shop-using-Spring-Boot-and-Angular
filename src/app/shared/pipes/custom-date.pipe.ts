import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customDate',
  standalone: true
})

export class CustomDatePipe implements PipeTransform {
  transform(value: number[] | undefined): string {
    if (!value || !Array.isArray(value) || value.length !== 5) {
      return ''; // Returns an empty string if the input is not an array of length 5
    }

    const [year, month, day, hours, minutes] = value;
    const date = new Date(year, month - 1, day, hours || 0, minutes || 0);

    if (isNaN(date.getTime())) {
      return 'Invalid date'; // Checks if the date is valid
    }

    return date.toLocaleDateString(); // Formats the date
  }
}
