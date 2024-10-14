import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import {MatMonthView} from "@angular/material/datepicker";
import {DatePipe} from "@angular/common";
import {FormsModule} from "@angular/forms";
//import { provideCharts } from 'ng2-charts';


@Component({
  selector: 'app-timesheet', // Make sure this selector is unique in your app
  templateUrl: './TimesheetComponent.html',
  standalone: true,
  imports: [
    DatePipe,
    FormsModule
  ],
  // Point to the correct HTML file
  styleUrls: ['./Timesheet.css'] // Point to the correct CSS file (optional)
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
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
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
