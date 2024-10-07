import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {provideNativeDateAdapter} from '@angular/material/core';
import {AuthService} from '../auth.service';



interface previousRequest {
  value: string;
  viewValue: string;
}


@Component({
  selector: 'app-form',
  providers: [provideNativeDateAdapter()],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})


export class HomeComponent {
  constructor (private authService: AuthService, private router: Router ) {}
  /* Sign In navigation Function */
  ngOnInit(){
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
    }
  }
  signIn() {
    this.router.navigate(['/login']);
  }
}
