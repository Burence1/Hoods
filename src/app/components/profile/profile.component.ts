import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ErrorStateMatcher } from '@angular/material/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { ProfileService } from 'src/app/services/profile/profile.service';


export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

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
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  profileForm: FormGroup
  selectedImage: any
  matcher = new MyErrorStateMatcher();
  hoods: Array<any>;
  user: any
  profile: any[]
  userData: any;
  username: string;
  occupant: string;
  email: string
  business: any[];

  constructor(
    private Auth: AngularFireAuth, private db: AngularFireDatabase, private service: ProfileService,
    private formBuilder: FormBuilder
  ) {
    this.Auth.authState.subscribe(auth => {
      if (auth !== undefined && auth !== null) {
        this.user = auth;
      }
      this.getUser().valueChanges().subscribe(res => {
        this.userData = res;
        this.username = this.userData.displayName
        this.occupant = this.userData.hood;
        this.email = this.userData.email

        firebase.database().ref('users/').on('value', resp => {
          const profileData = snapshotToArray(resp);
          this.profile = profileData.filter(x => x.email === this.email);
          console.log(this.profile)
        });

        firebase.database().ref('business/').on('value', resp => {
          const profileData = snapshotToArray(resp);
          this.business = profileData.filter(x => x.owner === this.username);
          console.log(this.business)
        });
      });
    });
  }

  getUser() {
    const userId = this.user.uid;
    const path = `/users/${userId}`;
    return this.db.object(path);
  }

  ngOnInit(): void {
    this.profileForm = this.formBuilder.group({
      name: [null, Validators.required],
      bio: [null, Validators.required],
      contact: [null, Validators.required],
      image: [null, Validators.required],
      hood: [null, Validators.required],
    });
  }

  getHoods() {
    return firebase.database().ref('hoods/').once("value", snap => {
      this.hoods = snapshotToArray(snap)
      console.log(this.hoods)
    })
  }

  newProfile(form: any) {
    const data = form
    this.service.addProfile(data, this.selectedImage)
  }

  showPreview(event: any) {
    this.selectedImage = event.target.files[0];
  }
}