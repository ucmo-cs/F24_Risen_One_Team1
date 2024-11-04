import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import * as XLSX from 'xlsx';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

interface Employee {
  name: string;
  userId: number;
  times: number[];
  totalHours: number;
}
interface Project {
  projectName: string;
  projectId: number;
}

@Component({
  selector: 'app-timesheet',
  templateUrl: './TimesheetComponent.html',
  styleUrls: ['./Timesheet.css']
})
export class TimesheetComponent implements OnInit {
  projects: Project[] = [];
  employees: Employee[] = [];
  days: string[] = [];
  monthInt: number = 0;
  selectedMonth: string = '';
  selectedYear: string = '2024'; // Default year
  months: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    //this.fetchData();
  }

  fetchData() {
    switch(this.selectedMonth) {
      case 'January':
        this.monthInt = 1;
        break;
      case 'February':
        this.monthInt = 2;
        break;
      case 'March':
        this.monthInt = 3;
        break;
      case 'April':
        this.monthInt = 4;
        break;
      case 'May':
        this.monthInt = 5;
        break;
      case 'June':
        this.monthInt = 6;
        break;
      case 'July':
        this.monthInt = 7;
        break;
      case 'August':
        this.monthInt = 8;
        break;
      case 'September':
        this.monthInt = 9;
        break;
      case 'October':
        this.monthInt = 10;
        break;
      case 'November':
        this.monthInt = 11;
        break;
      case 'December':
        this.monthInt = 12;
        break;
      default:
        this.monthInt = 0;
    }

    const body = { projectId: 111 };

    fetch('https://aytgdj4r8d.execute-api.us-east-1.amazonaws.com/BackToStart/readDB', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      mode: 'cors',
    })
      .then(response => response.json())
      .then(data => {
        const timesheetData = data.data.years[this.selectedYear][this.monthInt];
        console.log(timesheetData);
        this.employees = timesheetData.map((employee: any) => ({
          ...employee,
          totalHours: employee.times.reduce((sum: number, hours: number) => sum + hours, 0)
        }));
        this.updateDays();
      })
      .catch(error => {
        console.error('Error fetching data', error);
      });
  }

  updateDays() {
    const daysInMonth = new Date(parseInt(this.selectedYear), this.monthInt, 0).getDate();
    this.days = Array.from({ length: daysInMonth }, (_, i) => `${i + 1}`);
  }

  validateInput(event: any, employeeIndex: number, dayIndex: number) {
    const value = event.target.value;
    if (!/^\d*$/.test(value)) {
      event.target.value = value.replace(/[^\d]/g, '');
    }
    this.employees[employeeIndex].times[dayIndex] = +event.target.value;
    this.updateTotalHours();
  }

  updateTotalHours() {
    this.employees.forEach(employee => {
      employee.totalHours = employee.times.reduce((sum, current) => sum + current, 0);
    });
  }

  exportToExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([
      ['Employee Name:', ...this.employees.map(emp => emp.name)],
      ['Month:', this.selectedMonth],
      ['Days:', ...this.days],
      ...this.employees.map(emp => ['Hours:', ...emp.times]),
      ['Total Hours:', ...this.employees.map(emp => emp.totalHours)]
    ]);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Timesheet');

    const excelBuffer: any = XLSX.write(wb, {
      bookType: 'xlsx',
      type: 'array'
    });

    const data: Blob = new Blob([excelBuffer], { type: EXCEL_TYPE });
    const url = window.URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'exported-data_' + new Date().getTime() + EXCEL_EXTENSION;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  saveData() {
    console.log("Data saved successfully");
  }
}
