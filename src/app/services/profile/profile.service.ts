import { Profile } from './../../interfaces/profile/profile';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import firebase from 'firebase/app';
import 'firebase/auth';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
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
  profile: any;
  email: string
  profileData:any
  userProfile:any

  constructor(private db: AngularFireDatabase,
    private Auth: AngularFireAuth, private router: Router,
    private snackBar: MatSnackBar, private storage: AngularFireStorage) {
  }

  getProfile():Observable<Profile[]>{
    return this.db.list<Profile>('/users').valueChanges();
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

          const userId = this.user.uid;
          firebase.database().ref('users/' + userId).update(profile);
          const data = {
            hood: profile.hood,
            displayName: profile.name
          }
          this.db.object('users/' + userId).update(data);
        })
      })
    ).subscribe();
  }
}