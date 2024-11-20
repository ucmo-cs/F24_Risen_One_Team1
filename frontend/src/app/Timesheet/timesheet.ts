import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import fedHolidays from "@18f/us-federal-holidays";
import { Router } from '@angular/router';
import {AuthService} from '../auth.service';

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
  selectedYear: string = ''; // Default year
  months: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  years: string[] = [];
  user: string = '';
  signOffName: string = '';
  signOffDate: string = '';
  isEditMode: boolean = false;

  constructor(private http: HttpClient, private authService: AuthService, private router: Router) {
  }

  ngOnInit() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
    }
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      this.user = user.username; // Assuming 'username' is the specific value you want
    }
    this.fetchProjects();
    this.initializeYears();
  }

  resetData() {
    this.signOffName = '';
    this.signOffDate = '';
    this.employees = [];
    this.days = [];
  }

  initializeYears() {
    const currentYear = new Date().getFullYear();
    for (let year = currentYear - 5; year <= currentYear + 5; year++) {
      this.years.push(year.toString());
    }
  }

  updateYear(year: string) {
    this.resetData();
    this.selectedYear = year;
    this.selectedMonth = '';
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
    this.resetData();
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

    console.log(this.selectedProjectID);
    const body = { projectId: this.selectedProjectID };
    console.log(body);

    fetch('https://aytgdj4r8d.execute-api.us-east-1.amazonaws.com/BackToStart/readDB', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
      .then(response => response.json())
      .then(data => {
        const timesheetData = data.data.years[this.selectedYear][this.monthInt];
        console.log(timesheetData);
        this.signOffName = data.data.signOff.managerName;
        this.signOffDate = data.data.signOff.signDate;
        console.log(this.signOffName + ' ' + this.signOffDate);
        this.employees = timesheetData.map((employee: any) => ({
          ...employee,
          totalHours: employee.times.reduce((sum: number, hours: number) => sum + hours, 0)
        }));
        console.log(this.employees);
        console.log("After employees List")
        this.updateDays();
      })
      .catch(error => {
        console.error('Error fetching data', error);
      });
    //console.log("Employees" + this.employees+"Days"+this.days);
  }
  getProjectNameById(projectID: number): string {
    const project = this.projects.find(project => project.projectId === projectID);
    return project ? project.projectName : 'Unknown Project';
  }

  onProjectChange(projectID: number) {
    this.resetData();
    this.selectedProjectID = Number(projectID);
    this.selectedMonth ='';
    this.selectedYear = '';
    this.selectedProjectName = this.getProjectNameById(this.selectedProjectID);
    console.log("Selected projectName "+this.selectedProjectName);
    console.log("Selected projectID "+this.selectedProjectID);
    //this.fetchData(); // Fetch data for the selected project
  }

  updateDays() {
    const options = { shiftSaturdayHolidays: true, shiftSundayHolidays: true };
    const holidays = fedHolidays.allForYear(Number(this.selectedYear), options);
    const daysInMonth = new Date(parseInt(this.selectedYear), this.monthInt, 0).getDate();
    this.days = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(parseInt(this.selectedYear), this.monthInt - 1, day);
      const dayOfWeek = date.getDay();
      const dateString = date.toISOString().split('T')[0];

      if (dayOfWeek !== 0 && dayOfWeek !== 6 && !holidays.some(holiday => holiday.dateString === dateString)) {
        this.days.push(`${day}`);
      }
    }
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
    const element = document.querySelector('.timesheet') as HTMLElement; // Select the element you want to capture

    if(element){
      html2canvas(element).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`Timesheet_${this.selectedProjectName}_${this.selectedMonth}_${this.selectedYear}.pdf`);
      }).catch(error => {
        console.error('Error capturing the page', error);
      });
    }
  }



  Edit() {
    this.isEditMode = !this.isEditMode;
    console.log(`Edit mode: ${this.isEditMode ? 'Enabled' : 'Disabled'}`);
  }



  saveData() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = today.getFullYear();

    const body = {
      projectId: this.selectedProjectID,
      year: this.selectedYear,
      month: this.monthInt,
      data: this.employees,
      signOff: {
        managerName: this.user,
        signDate: `${month}-${day}-${year}`
      }
    };
    console.log("Body "+body);
    // fetch('https://aytgdj4r8d.execute-api.us-east-1.amazonaws.com/BackToStart/writeDB', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(body),
    // })
    //   .then(response => response.json())
    //   .then(data => {
    //     console.log(data);
    //   })
    //   .catch(error => {
    //     console.error('Error saving data', error);
    //
    //   });
    console.log("Raw body " + JSON.stringify(body));
    console.log("Raw data ");
    console.log("Employees" + this.employees);
    console.log("Project Name "+this.selectedProjectName);
    console.log("Project ID "+this.selectedProjectID);
    console.log("Month "+this.selectedMonth);
    console.log("Year "+this.selectedYear);
    console.log("Data saved successfully");
  }
}

