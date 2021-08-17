import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase/app';
import 'firebase/auth';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

export const snapshotToArray = (snapshot: any) => {
  const returnArr: any[] = [];

  snapshot.forEach((childSnapshot: any) => {
    const item = childSnapshot.val();
    item.key = childSnapshot.key;
    returnArr.push(item);
  });

  return returnArr;
};

@Injectable({
  providedIn: 'root'
})
export class HoodsService {


  user: any;
  username:string;
  occupant:any;
  hood:any;
  userData:any;
  ref:any;

  constructor(private db: AngularFireDatabase,
    private Auth: AngularFireAuth, private router: Router,
    private snackBar: MatSnackBar) {
    this.Auth.authState.subscribe(auth => {
      if (auth !== undefined && auth !== null) {
        this.user = auth;
      }
      this.getUser().valueChanges().subscribe(res => {
        this.userData = res;
        this.username = this.userData.displayName
        this.occupant = this.userData.hood;
      });

      firebase.database().ref('hoods/').on('value', resp => {
        const hoodData = snapshotToArray(resp);
        this.hood = hoodData.filter(x => x.title === this.occupant);
      });
    });
  }

  getUser() {
    const userId = this.user.uid;
    const path = `/users/${userId}`;
    return this.db.object(path);
  }

  getHood(){
    return this.hood
  }

  addHood(form: any) {
    this.ref = firebase.database().ref('hoods/');
    const hood = form;
    hood.admin = this.username;
    this.ref.orderByChild('title').equalTo(hood.title).once('value', (snapshot: any) => {
      if (snapshot.exists()) {
        this.snackBar.open('Hood already exist!', 'undo', {
          duration: 2000
        });
      } else {
        const newHood = firebase.database().ref('hoods/').push();
        newHood.set(hood);
      }
    });
  }
}