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
export class PostsService {

  user: any;
  chatname: string;
  data: any
  userData:any
  img:any
  ref:any

  constructor(private db: AngularFireDatabase,
    private Auth: AngularFireAuth, private router: Router,
    private snackBar: MatSnackBar, private storage: AngularFireStorage) {
    this.Auth.authState.subscribe(auth => {
      if (auth !== undefined && auth !== null) {
        this.user = auth;
      }
      this.getUser().valueChanges().subscribe(res => {
        this.userData = res;
        this.data = this.userData.hood
        this.chatname = this.userData.displayName;
      });
    });
  }

  getUser() {
    const userId = this.user.uid;
    const path = `/users/${userId}`;
    return this.db.object(path);
  }

  addPost(form: any, selectedImage: any) {
    this.ref = firebase.database().ref('posts/');
    var name = selectedImage.name;
    const path = `posts/${name}`
    const fileRef = this.storage.ref(path);
    this.storage.upload(path, selectedImage).snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe((url) => {
          const post = form;
          post.author = this.chatname;
          post.hood = this.data;
          this.img = url;
          post.image = this.img
          const newHood = firebase.database().ref('posts/').push();
          newHood.set(post);

        })
      })
    ).subscribe();
  }
}
