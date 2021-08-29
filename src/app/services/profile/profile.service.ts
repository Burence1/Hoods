import { Profile } from './../../interfaces/profile/profile';
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

  user: any;
  userData: any;
  username: string;
  occupant: string;
  ref: any
  img: any
  profile: any[];
  email: string
  profileData:any
  userProfile:any

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
        this.email = this.userData.email

        // firebase.database().ref('users/').on('value', resp => {
        //   const profileData = snapshotToArray(resp);
        //   this.profile = profileData.filter(x => x.email === this.email);
        //   console.log(this.profile)
        // });
      });
    });
  }
  getUser() {
    const userId = this.user.uid;
    const path = `/users/${userId}`;
    return this.db.object(path);
  }

  addProfile(form: any, selectedImage: any) {
    this.ref = firebase.database().ref('users/');
    var name = selectedImage.name;
    const path = `profiles/${name}`
    const fileRef = this.storage.ref(path);
    this.storage.upload(path, selectedImage).snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe((url) => {
          const profile = form;
          profile.email = this.user.email
          this.img = url;
          profile.image = this.img
          console.log(profile.image)

          const userId = this.user.uid;
          firebase.database().ref('users/' + userId).update(profile);
          const data = {
            hood: profile.hood,
            displayName: profile.name
          }
          this.db.object('users/' + userId).update(data);

          // this.ref.orderByChild('email').equalTo(profile.email).once('value', (snapshot: any) => {
          //   if (snapshot.exists()) {
          //     this.snackBar.open('Profile already exist!', 'undo', {
          //       duration: 2000
          //     });
          //   } else {


          //   }
          // });
        })
      })
    ).subscribe();
  }
}