import { Component, OnInit } from '@angular/core';
import {Timesheet} from "./Timesheet";

@Component({
  selector: 'app-timesheet',
  templateUrl: './timesheet.component.html',
})
export class TimesheetComponent {
  timesheet = [
    { date: new Date(2024, 1, 1), hoursWorked: 0, description: '' },
    // Add more days as needed
  ];

  calculateTotalHours() {
    return this.timesheet.reduce((total, day) => total + day.hoursWorked, 0);
  }
}
