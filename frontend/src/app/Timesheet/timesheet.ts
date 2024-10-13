import { Component, OnInit } from '@angular/core';
import {Chart} from "chart.js";
import {MatMonthView} from "@angular/material/datepicker";
import {FormsModule} from "@angular/forms";
import {DatePipe} from "@angular/common";
//import {Timesheet} from "./Timesheet";



@Component({
  selector: 'app-timesheet',
  templateUrl: './TimesheetComponent.html',
  imports: [
    FormsModule,
    DatePipe
  ],
  standalone: true
})
export class Timesheet implements OnInit{
  ngOnInit(): void {
      throw new Error('Method not implemented.');
  }
  timesheet = [
    { date: new Date(2024, 1, 1), hoursWorked: 0, description: '' },
    // Add more days as needed
  ];

  calculateTotalHours() {
    return this.timesheet.reduce((total, day) => total + day.hoursWorked, 0);
  }


  protected readonly name = name;
  protected readonly MatMonthView = MatMonthView;
  protected readonly Chart = Chart;
}
