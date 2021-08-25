import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ErrorStateMatcher } from '@angular/material/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';


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
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

  allCategories:any[];

  constructor(private db: AngularFireDatabase) {
    firebase.database().ref('categories/').on('value', resp => {
      const hoodData = snapshotToArray(resp);
      // this.userHood = hoodData.filter(x => x.title === this.data);
      // console.log(this.userHood)
      this.allCategories = hoodData
      console.log(this.allCategories)
    });
   }

  ngOnInit(): void {
  }

  categoryBusinesses(businesses:string){
    console.log(businesses)
  }

}
