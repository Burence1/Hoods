import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import firebase from 'firebase/app';
import 'firebase/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';

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
export class BusinessService {

  user: any;
  username: string;
  business: any;
  userData: any;
  ref: any;
  img: any;
  hoods:any[];
  userHood:any;
  data: any
  userName:any;
  chatname:string


  constructor(private db: AngularFireDatabase,
    private Auth: AngularFireAuth, private router: Router,
    private snackBar: MatSnackBar, private storage: AngularFireStorage) {
    this.Auth.authState.subscribe(auth => {
      if (auth !== undefined && auth !== null) {
        this.user = auth;
      }
      this.getUser().valueChanges().subscribe(res => {
        this.userName = res;
        this.data = this.userName.hood
        console.log(this.data)
        this.chatname = this.userName.displayName;
      });
    });
  }

  getUser() {
    const userId = this.user.uid;
    const path = `/users/${userId}`;
    return this.db.object(path);
  }

  
  addBusiness(form: any, selectedImage: any) {
    this.ref = firebase.database().ref('business/');
    var name = selectedImage.name;
    const path = `businesses/${name}`
    const fileRef = this.storage.ref(path);
    this.storage.upload(path, selectedImage).snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe((url) => {
          const business = form;
          business.owner = this.chatname;
          business.hood = this.data;
          console.log(business.hood)
          this.img = url;
          business.image = this.img
          console.log(business.image)

          this.ref.orderByChild('title').equalTo(business.title).once('value', (snapshot: any) => {
            if (snapshot.exists()) {
              this.snackBar.open('Business already exist!', 'undo', {
                duration: 2000
              });
            } else {
              const newHood = firebase.database().ref('business/').push();
              newHood.set(business);
            }
          });
        })
      })
    ).subscribe();
  }

  addCategory(form: any, selectedImage: any) {
    this.ref = firebase.database().ref('categories/');
    var name = selectedImage.name;
    const path = `categories/${name}`
    const fileRef = this.storage.ref(path);
    this.storage.upload(path, selectedImage).snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe((url) => {
          const business = form;
          this.img = url;
          business.image = this.img
          console.log(business.image)

          this.ref.orderByChild('title').equalTo(business.title).once('value', (snapshot: any) => {
            if (snapshot.exists()) {
              this.snackBar.open('Category already exist!', 'undo', {
                duration: 2000
              });
            } else {
              const newHood = firebase.database().ref('categories/').push();
              newHood.set(business);
            }
          });
        })
      })
    ).subscribe();
  }
}
