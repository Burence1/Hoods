import { Component, OnInit } from '@angular/core';
import { HoodsService } from 'src/app/services/hoods/hoods.service';
import { Observable } from 'rxjs';
import { ErrorStateMatcher } from '@angular/material/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';

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
  selector: 'app-hood',
  templateUrl: './hood.component.html',
  styleUrls: ['./hood.component.css']
})

export class HoodComponent implements OnInit {


  hoodForm: FormGroup
  matcher = new MyErrorStateMatcher();
  imageInput: string;
  selectedImage: any = null;
  file: string;
  allHoods: any[];
  userName: any
  chatname: any
  data: any
  user: any;
  userHood: any;

  image:any
  location:any
  title:any
  description:any

  sideBarOpen = true;

  sideBarToggler() {
    this.sideBarOpen = !this.sideBarOpen;
  }

  constructor(private Auth: AngularFireAuth, private db: AngularFireDatabase, private service: HoodsService,
    private formBuilder: FormBuilder) {
    this.Auth.authState.subscribe(auth => {
      if (auth !== undefined && auth !== null) {
        this.user = auth;
      }
      this.service.getUser().valueChanges().subscribe(a => {
        this.userName = a;
        this.data = this.userName.hood
        this.chatname = this.userName.displayName;
      });
    });
  }

  ngOnInit(): void {
    this.hoodForm = this.formBuilder.group({
      title: [null, Validators.required],
      description: [null, Validators.required],
      location: [null, Validators.required],
      image: [null, Validators.required],
    });
    this.getHood()
  }

  newHood(form: any) {
    const data = form
    this.service.addHood(data, this.selectedImage)
  }

  getHood() {
    this.service.getHoods().subscribe(x =>{
      this.allHoods = x
    })
  }

  currentUser() {
    this.service.getUser()
  }

  showPreview(event: any) {
    this.selectedImage = event.target.files[0];
  }
}