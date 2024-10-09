import { Component, OnInit } from '@angular/core';

interface TimesheetDay {
  date: Date;
  hoursWorked: number;
  description: string;
}

@Component({
  selector: 'app-timesheet',
  templateUrl: './timesheet.component.html',
  styleUrls: ['./timesheet.component.css']
})
export class TimesheetComponent implements OnInit {

  timesheet: TimesheetDay[] = [];

  ngOnInit() {
    this.generateTimesheetForMonth(new Date());  // Generate timesheet for current month
  }

  generateTimesheetForMonth(currentDate: Date) {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Get the number of days in the month
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Generate the array of days
    for (let day = 1; day <= daysInMonth; day++) {
      this.timesheet.push({
        date: new Date(year, month, day),
        hoursWorked: 0, // default value
        description: '' // default value
      });
    }
  }

  calculateTotalHours(): number {
    return this.timesheet.reduce((total, day) => total + day.hoursWorked, 0);
  }
}
