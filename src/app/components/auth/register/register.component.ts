import { Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { HoodsService } from 'src/app/services/hoods/hoods.service';
import { MatDialog} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import firebase from 'firebase/app';
import 'firebase/auth';

export const snapshotToArray = (snapshot: any) => {
  const returnArr: any[] = [];

  snapshot.forEach((childSnapshot: any) => {
    const item = childSnapshot.val();
    item.key = childSnapshot.key;
    returnArr.push(item);
  });

  return returnArr;
};

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
  hoods: Array<any>;

  constructor(private auth: AuthService, private hservice: HoodsService) { }

  ngOnInit(): void {
    this.getHoods()
  }


  getHoods() {
    return firebase.database().ref('hoods/').once("value", snap => {
      this.hoods = snapshotToArray(snap)
    })
  }

  onRegister(formData:any) {
    if (formData.valid) {
      this.auth.emailSignup(
        formData.value.displayName,
        formData.value.email,
        formData.value.password,
        formData.value.confirmPassword,
        formData.value.hood.title,
      );
    }
  }

}