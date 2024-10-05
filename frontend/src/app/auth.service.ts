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
          this.router.navigate(['/home']);
        }
        else{ // todo - figure out how to hard reload the page or display a login failed message
          loginStatus.error('Login failed'); // Notify subscribers that login failed

        }
      })
      .catch((error) => {
        console.error('Error:', error);
        loginStatus.error('Incorrect login information, please try again'); // Notify subscribers that login failed
      });

    return loginStatus.asObservable();

    // return new Observable<boolean>((observer) => {
    //   fetch('https://aytgdj4r8d.execute-api.us-east-1.amazonaws.com/dev/login', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //       username: username,
    //       password: password,
    //     }),
    //   })
    //     .then(response => {
    //       console.log('Response' + response.json());
    //       if(response.ok){
    //         observer.next(true); // Notify subscribers that login was successful
    //         observer.complete(); // Complete the observable
    //         //this.router.navigate(['/home']);
    //       }
    //       else{
    //         observer.error('Login failed'); // Notify subscribers that login failed
    //       }
    //     })
    //     .catch((error) => {
    //       console.error('Error:', error);
    //       observer.error('Login failed'); // Notify subscribers that login failed
    //     });
    // });
  }

  logout() {
    // Your logout logic with Lambda function
    // Simulating success for demonstration purposes
    const logoutSuccess = true;

    if (logoutSuccess) {
      // Redirect to login page or any other desired page
      this.router.navigate(['/login']);
    } else {
      // Handle logout failure
      console.error('Logout failed');
    }
  }
}
