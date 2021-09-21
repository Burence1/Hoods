import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  hide = true;

  email: any;
  password: string;

  constructor(private auth:AuthService) { }

  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }


  emailLogin(formData:any){
    if (formData.valid) {
      this.auth.login(formData.value.email, formData.value.password);
    }
  }

  ngOnInit(): void {
  }
  

}
