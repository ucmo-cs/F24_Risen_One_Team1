import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient,private router: Router) { }
  private url = 'https://aytgdj4r8d.execute-api.us-east-1.amazonaws.com/BackToStart/login'

  login(username: string, password: string): Observable<boolean> {

    const loginStatus = new Subject<boolean>();

    fetch('https://aytgdj4r8d.execute-api.us-east-1.amazonaws.com/BackToStart/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    })
      .then(response => {
        console.log('Response' + response.json());
        if(response.ok){
          loginStatus.next(true); // Notify subscribers that login was successful
          loginStatus.complete(); // Complete the observable
        }
        else if(response.status === 401){
          loginStatus.next(false); //notify subscribers that login failed but due to credentials
        }
        else{
          loginStatus.error('Login failed'); // Notify subscribers that login failed
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        loginStatus.error('Incorrect login information, please try again'); // Notify subscribers that login failed
      });

    return loginStatus.asObservable();

  }

  logout() {
    // Your logout logic with Lambda function
    // Simulating success for demonstration purposes
    const logoutSuccess = true;

    if (logoutSuccess) {
      // Redirect to login page or any other desired page
      localStorage.removeItem('user');
      this.router.navigate(['/login']);
    } else {
      // Handle logout failure
      console.error('Logout failed');
    }
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('user') !== null;
  }
}
