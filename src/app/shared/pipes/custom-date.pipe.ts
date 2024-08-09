import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customDate',
  standalone: true
})

export class CustomDatePipe implements PipeTransform {
  transform(value: number[] | undefined): string {
    if (!value || !Array.isArray(value)) {
      return ''; // Returns an empty string if the input is not an array
    }

    // Default values for time
    let year = 0, month = 0, day = 0, hours = 0, minutes = 0;

    // Assign values based on array length
    if (value.length === 3) {
      [year, month, day] = value;
    } else if (value.length === 5) {
      [year, month, day, hours, minutes] = value;
    } else {
      return 'Invalid format'; // Handle unexpected formats
    }

    const date = new Date(year, month - 1, day, hours, minutes);

    if (isNaN(date.getTime())) {
      return 'Invalid date'; // Checks if the date is valid
    }

    return date.toLocaleDateString(); // Formats the date
  }

}
