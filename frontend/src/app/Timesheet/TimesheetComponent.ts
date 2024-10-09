import { Component, OnInit } from '@angular/core';

export interface Timesheet {
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
  timesheet: Timesheet[] = [];  // <-- Define the 'timesheet' variable here

  ngOnInit(): void {
    this.generateTimesheetForMonth();
  }

  generateTimesheetForMonth(): void {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Generate a timesheet for each day of the current month
    for (let day = 1; day <= daysInMonth; day++) {
      this.timesheet.push({
        date: new Date(year, month, day),
        hoursWorked: 0,
        description: ''
      });
    }
  }

  calculateTotalHours(): number {
    return this.timesheet.reduce((total, day) => total + day.hoursWorked, 0);
  }
}

