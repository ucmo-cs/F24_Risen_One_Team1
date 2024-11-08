import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import fedHolidays from "@18f/us-federal-holidays";

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
  getProjectNameById(projectID: number): string {
    const project = this.projects.find(project => project.projectId === projectID);
    return project ? project.projectName : 'Unknown Project';
  }

  onProjectChange(projectID: number) {
    this.selectedProjectID = Number(projectID);
    this.selectedMonth ='';
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
  //   const pdf = new jsPDF('p', 'mm', 'a4');
  //
  //   // Add title
  //   pdf.setFontSize(20);
  //   pdf.text('Timesheet for ' + this.selectedMonth + ' ' + this.selectedYear, 20, 10);
  //
  //   // Add project name
  //   pdf.setFontSize(14);
  //   pdf.text('Project: ' + this.selectedProjectName, 20, 20);
  //
  //   // Set starting position for the table
  //   let startY = 30
  //   const rowHeight = 5;
  //   const colWidth = 5;
  //
  //   // Add table headers
  //   pdf.setFontSize(10);
  //   pdf.text('Name', 20, startY);
  //   this.days.forEach((day, index) => {
  //     pdf.text(day, 40 + index * colWidth, startY);
  //   });
  //   pdf.text('Total', 60 + this.days.length * colWidth, startY);
  //
  //   // Draw header borders
  //   pdf.rect(40, startY - rowHeight, colWidth * 2, rowHeight);
  //   this.days.forEach((_, index) => {
  //     pdf.rect( 40+ index * colWidth, startY - rowHeight, colWidth, rowHeight);
  //   });
  //   pdf.rect(60 + this.days.length * colWidth, startY - rowHeight, colWidth, rowHeight);
  //
  //
  //   // Add table data
  //   this.employees.forEach((employee, rowIndex) => {
  //     const rowY = startY + (rowIndex + 1) * rowHeight;
  //     pdf.text(employee.name, 20, rowY);
  //     employee.times.forEach((time, colIndex) => {
  //       pdf.text(time.toString(), 40 + colIndex * colWidth, rowY);
  //     });
  //     pdf.text(employee.totalHours.toString(), 40 + this.days.length * colWidth, rowY);
  //
  //     // Draw data borders
  //     pdf.rect(20, rowY - rowHeight, colWidth * 2, rowHeight);
  //     employee.times.forEach((_, colIndex) => {
  //       pdf.rect(40 + colIndex * colWidth, rowY - rowHeight, colWidth, rowHeight);
  //     });
  //     pdf.rect(40 + this.days.length * colWidth, rowY - rowHeight, colWidth, rowHeight);
  //
  //   });
  //   console.log("Project Name "+this.selectedProjectName)
  //   // Save the PDF
  //   pdf.save(`Timesheet_${this.selectedProjectName}_${this.selectedMonth}_${this.selectedYear}.pdf`);
  // }

  saveData() {
    console.log("Data saved successfully");
  }
}
