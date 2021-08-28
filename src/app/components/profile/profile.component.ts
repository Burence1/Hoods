import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ErrorStateMatcher } from '@angular/material/core';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
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
  selectedImage:any
  matcher = new MyErrorStateMatcher();
  hoods: Array<any>;

  constructor(
    private Auth: AngularFireAuth, private db: AngularFireDatabase, private service: ProfileService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.profileForm = this.formBuilder.group({
      name: [null, Validators.required],
      bio: [null, Validators.required],
      contact: [null, Validators.required],
      image: [null, Validators.required],
      hood:[null,Validators.required],
    });
    this.getHoods()
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
