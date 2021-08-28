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
export class ProfileService {

  user:any;
  userData:any;
  username:string;
  occupant:string;
  ref: any
  img:any

  constructor(private db: AngularFireDatabase,
    private Auth: AngularFireAuth, private router: Router,
    private snackBar: MatSnackBar, private storage: AngularFireStorage) {
    this.Auth.authState.subscribe(auth => {
      if (auth !== undefined && auth !== null) {
        this.user = auth;
      }
      this.getUser().valueChanges().subscribe(res => {
        this.userData = res;
        this.username = this.userData.displayName
        this.occupant = this.userData.hood;
      });});
     }
  getUser() {
    const userId = this.user.uid;
    const path = `/users/${userId}`;
    return this.db.object(path);
  }

  addProfile(form: any, selectedImage: any) {
    this.ref = firebase.database().ref('profiles/');
    var name = selectedImage.name;
    const path = `profiles/${name}`
    const fileRef = this.storage.ref(path);
    this.storage.upload(path, selectedImage).snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe((url) => {
          const profile = form;
          profile.user = this.user.uid;
          this.img = url;
          profile.image = this.img
          console.log(profile.image)

          this.ref.orderByChild('name').equalTo(profile.name).once('value', (snapshot: any) => {
            if (snapshot.exists()) {
              this.snackBar.open('Profile already exist!', 'undo', {
                duration: 2000
              });
            } else {
              const userId = this.user.uid;
              const path = `/users/${userId}`;
              const newHood = firebase.database().ref('profiles/').push();
              newHood.set(profile);
              const data = {
                hood: profile.hood,
              }
              this.db.object('users/' + userId).update(data);

              // firebase.database().ref('users/'+userId).update(profile.hood);
            }
          });
        })
      })
    ).subscribe();
  }
}
