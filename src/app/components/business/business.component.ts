import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ErrorStateMatcher } from '@angular/material/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { BusinessService } from 'src/app/services/business/business.service';
import { Router, ActivatedRoute } from '@angular/router';

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
  selector: 'app-business',
  templateUrl: './business.component.html',
  styleUrls: ['./business.component.css']
})
export class BusinessComponent implements OnInit {

  matcher = new MyErrorStateMatcher();
  businessForm : FormGroup
  categoryForm: FormGroup
  imageInput: string;
  selectedImage: any = null;
  file: string;
  allBusiness: any[];
  userName: any
  chatname: any
  data: any
  user: any;
  businessHood: any[];
  businessCategory:string;
  businesses: Array<any>;
  filterData:any;

  constructor(private Auth: AngularFireAuth, private db: AngularFireDatabase, private service: BusinessService,
    private formBuilder: FormBuilder,private route:ActivatedRoute) {
    this.Auth.authState.subscribe(auth => {
      if (auth !== undefined && auth !== null) {
        this.user = auth;
      }
      this.getUser().valueChanges().subscribe(a => {
        this.userName = a;
        this.data = this.userName.hood
        console.log(this.data)
        this.chatname = this.userName.displayName;

        this.businessCategory = this.route.snapshot.params.businesses;
        console.log(this.businessCategory)
        firebase.database().ref('business/').on('value', resp => {
          const businessData = snapshotToArray(resp);
          this.businessHood = businessData.filter(x => x.hood === this.data && x.category === this.businessCategory);

          // this.filterData = this.businessHood.filter(x => x.category === this.businessCategory);
          // console.log(this.businessHood)
          // console.log(this.filterData)
          this.allBusiness = businessData
          console.log(this.allBusiness)
        });
      });
    });
  }

  getCategory() {
    return firebase.database().ref('categories/').once("value", snap => {
      this.businesses = snapshotToArray(snap)
      console.log(this.businesses)
    })
  }

  getUser() {
    const userId = this.user.uid;
    const path = `/users/${userId}`;
    return this.db.object(path);
  }

  newBusiness(form: any) {
    const data = form
    this.service.addBusiness(data, this.selectedImage)
  }

  newCategory(form: any) {
    const data = form
    this.service.addCategory(data, this.selectedImage)
  }


  ngOnInit(): void {
    this.businessForm = this.formBuilder.group({
      title: [null, Validators.required],
      description: [null, Validators.required],
      location: [null, Validators.required],
      image: [null, Validators.required],
      category: [null, Validators.required],
    });

    this.categoryForm = this.formBuilder.group({
      title: [null, Validators.required],
      image: [null, Validators.required],
    });

    this.getCategory()
  }

  showPreview(event: any) {
    this.selectedImage = event.target.files[0];
  }
}
