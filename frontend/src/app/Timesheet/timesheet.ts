import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

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
  selectedProjectName: string = '';
  selectedProjectID: number = 0;
  selectedMonth: string = '';
  selectedYear: string = '2024'; // Default year
  months: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.fetchProjects();
  }

  fetchProjects() {
    fetch('https://aytgdj4r8d.execute-api.us-east-1.amazonaws.com/BackToStart/getAllProjects', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },

    })
      .then(response => response.json())
      .then(data => {
        this.projects = data.data;
        console.log(this.projects);
      })
      .catch(error => {
        console.error('Error fetching data', error);
      });
  }


  fetchData() {
    switch (this.selectedMonth) {
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

    const body = {projectId: 111};

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

  onProjectChange(projectID: number) {
    const selectedProject = this.projects.find(project => project.projectId === projectID);
    if (selectedProject) {
      this.selectedProjectName = selectedProject.projectName;
      this.selectedProjectID = selectedProject.projectId;
    }
  }

  updateDays() {
    const daysInMonth = new Date(parseInt(this.selectedYear), this.monthInt, 0).getDate();
    this.days = Array.from({length: daysInMonth}, (_, i) => `${i + 1}`);
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

  exportToPDF() {
    const pdf = new jsPDF('p', 'mm', 'a4');

    // Add title
    pdf.setFontSize(20);
    pdf.text('Timesheet for ' + this.selectedMonth + ' ' + this.selectedYear, 10, 10);

    // Add project name
    pdf.setFontSize(14);
    pdf.text('Project: ' + this.selectedProjectName, 10, 20);
    let startY = 30;
    startY += 10;
    // Add table header
    pdf.setFontSize(12);
    let row = ['Employee Name', ...this.days, 'Total Hours'];
    let colWidth = pdf.internal.pageSize.getWidth() / (row.length + 1);
    pdf.text(row, 10, startY);

    // Move to the next line
    startY += 20;


    // Add employee data
    this.employees.forEach(employee => {
        let employeeData = [
          employee.name,
          ...employee.times.map(time => time.toString()),
          employee.totalHours.toString()
        ];
        pdf.text(employeeData, 10, startY);
        startY += 10;
            pdf.save(`Timesheet_${this.selectedMonth}_${this.selectedYear}.pdf`);
            console.log('PDF saved');
          }
          ,)
      }
  saveData() {
    console.log("Data saved successfully");
  }
}
