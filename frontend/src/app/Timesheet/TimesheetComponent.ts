import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import {MatMonthView} from "@angular/material/datepicker";
import {DatePipe} from "@angular/common";
import {FormsModule} from "@angular/forms";


@Component({
  selector: 'app-timesheet',
  templateUrl: './TimesheetComponent.html',
  standalone: true,
  imports: [
    DatePipe,
    FormsModule
  ],
  // Point to the correct HTML file
  styleUrls: ['./Timesheet.css']
})
export class TimesheetComponent implements OnInit {
  name: string = 'John Doe';
  timesheet: { date: Date, hoursWorked: number, description: string }[] = [
    { date: new Date(), hoursWorked: 0, description: '' }
  ];

  chart: any;

  ngOnInit(): void {
    this.createChart();
  }

  createChart() {
    const ctx = document.getElementById('timesheetChart') as HTMLCanvasElement;

    if (ctx) {
      this.chart = new Chart(ctx.getContext('2d')!, {
        type: 'bar',
        data: {
          labels: this.timesheet.map(day => day.date.getDate().toString()),
          datasets: [{
            label: 'Hours Worked',
            data: this.timesheet.map(day => day.hoursWorked),
            borderColor: 'black',
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  }

  calculateTotalHours(): number {
    return this.timesheet.reduce((total, day) => total + day.hoursWorked, 0);
  }

  protected readonly MatMonthView = MatMonthView;
  protected readonly Chart = Chart;
}
