import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css']
})
export class PasswordResetComponent implements OnInit {
  email: string;

  constructor(private auth:AuthService) { }

  resetPassword(email:string) {
    this.auth.resetPassword(this.email);
  }

  ngOnInit(): void {
  }

}
