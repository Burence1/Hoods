import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  hide = true;

  email: string;
  password: string;
  confirmPassword: string;
  displayName: string;

  constructor(private auth:AuthService) { }

  ngOnInit(): void {
  }

  onRegister(formData:any) {
    if (formData.valid) {
      this.auth.emailSignup(
        formData.value.displayName,
        formData.value.email,
        formData.value.password,
        formData.value.confirmPassword
      );
    }
  }

}
