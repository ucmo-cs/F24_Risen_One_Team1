import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-timesheet',
  templateUrl: './TimesheetComponent.html',
  styleUrls: ['./Timesheet.css']
})

export class TimesheetComponent {
  [x: string]: any;

  employeeName: string = '';
  selectedMonth: string = '';
  months: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  days: string[] = [];
  chartData: number[] = [];
  totalHours: number = 0;  // New variable to store total hours

  constructor() {
    this.updateDays();
  }

  updateDays() {
    // Calculate the number of days in the selected month
    const daysInMonth = new Date(2024, this.months.indexOf(this.selectedMonth) + 1, 0).getDate();

    // Create an array of day numbers
    this.days = Array.from({length: daysInMonth}, (_, i) => `${i + 1}`);

    // Reset the chart data to 0 for each day
    this.chartData = Array(daysInMonth).fill(0);

    this.updateTotalHours();
  }


  validateInput(event: any) {
    //  only numbers are entered in the input field
    const value = event.target.value;
    if (!/^\d*$/.test(value)) {
      event.target.value = value.replace(/[^\d]/g, '');
    }
    this.updateTotalHours();
  }

  updateTotalHours() {
    this.totalHours = this.chartData.reduce((sum, current) => sum + current, 0);
  }

  exportToExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([
      ['Employee Name:', this.employeeName],
      ['Month:', this.selectedMonth],
      ['Days:', ...this.days],
      ['Hours:', ...this.chartData],
      ['Total Hours:', this.totalHours]
    ]);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Timesheet');

    const excelBuffer: any = XLSX.write(wb, {
      bookType: 'xlsx',
      type: 'array'
    });

        this['saveAsExcelFile'](excelBuffer, 'exported-data');
  }


  onSave() {
    if (this['timesheet'].valid) {
      // Get the form values
      const formData = this['timesheet'].value;


      this.saveData(formData);
    } else {
      console.log('Form is invalid');
    }
  }

  saveData(data: any) {
    console.log('Saved data:', data);
  }
}
