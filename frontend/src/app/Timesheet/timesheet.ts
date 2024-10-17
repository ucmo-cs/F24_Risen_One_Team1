import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

@Component({
  selector: 'app-timesheet',
  templateUrl: './timesheet.html',
  styleUrls: ['./Timesheet.css']
})
export class TimesheetComponent {
  employeeName: string = '';
  selectedMonth: string = '';
  months: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  days: string[] = [];
  chartData: number[] = [];

  constructor() {
    this.updateDays();
  }

  updateDays() {
    // Calculate the number of days in the selected month
    const daysInMonth = new Date(2024, this.months.indexOf(this.selectedMonth) + 1, 0).getDate();

    // Create an array of day numbers
    this.days = Array.from({ length: daysInMonth }, (_, i) => `${i + 1}`);

    // Reset the chart data to 0 for each day
    this.chartData = Array(daysInMonth).fill(0);
  }

  validateInput(event: any) {
    //  only numbers are entered in the input field
    const value = event.target.value;
    if (!/^\d*$/.test(value)) {
      event.target.value = value.replace(/[^\d]/g, '');
    }
  }
}
