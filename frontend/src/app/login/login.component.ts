import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {provideNativeDateAdapter} from '@angular/material/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../auth.service';


interface previousRequest {
  value: string;
  viewValue: string;
}



@Component({
  selector: 'app-login',
  providers: [provideNativeDateAdapter()],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private authService: AuthService, private router: Router, private formBuilder: FormBuilder) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value.username, this.loginForm.value.password)
        .subscribe({
          next: (success) => {
            if (success) {
              this.router.navigate(['/home']);
            } else {
              console.error('Login failed');
            }
          },
          error: (error) => {
            console.error('Login error:', error);
          }
        });
    }
  }
}






