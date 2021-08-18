import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase/app';
import 'firebase/auth';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';

export interface Data{
  name:string;
  url:string;
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

@Injectable({
  providedIn: 'root'
})
export class HoodsService {

  
  name = '!!!';
  selectedImage: any = null;
  user: any;
  username:string;
  occupant:any;
  hood:any;
  userData:any;
  ref:any;
  img:any;
  imageDetailList: AngularFireList<any>;
  fileList: any[];
  dataSet: Data = {
    name: '',
    url: ''
  };
  msg = 'error';

  constructor(private db: AngularFireDatabase,
    private Auth: AngularFireAuth, private router: Router,
    private snackBar: MatSnackBar,private storage:AngularFireStorage) {
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
        this.hood = hoodData.filter(x => x.title === 'moringa');
        console.log(this.hood)
      });
    });
  }

  getUser() {
    const userId = this.user.uid;
    const path = `/users/${userId}`;
    return this.db.object(path);
  }

  getHood(){
    const data = this.hood
    console.log(this.hood)
    return data
  }

  addHood(form: any,selectedImage:any) {
    this.ref = firebase.database().ref('hoods/');
    
    const title = form.title
    var name = selectedImage.name;
    const path = `neighborhoods/${name}`
    const fileRef = this.storage.ref(path);
    this.storage.upload(path, selectedImage).snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe((url) => {

          const hood = form;
          hood.admin = this.username;
          this.img = url;
          hood.image = this.img
          console.log(hood.image)

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
        })
      })
    ).subscribe();
  }

  getImageDetailList() {
    this.imageDetailList = this.db.list('imageDetails');
  }
  

  insertImageDetails(name:string, url:string) {
    this.dataSet = {
      name,
      url
    };
    this.imageDetailList.push(this.dataSet);
  }

  getImage(value:any) {
    this.imageDetailList.snapshotChanges().subscribe(
      list => {
        this.fileList = list.map((item:any) => item.payload.val());
        this.fileList.forEach(element => {
          if (element.id === value) {
            this.msg = element.url;
          }
        });
        if (this.msg === 'error') {
          alert('No record found');
        }
        else {
          window.open(this.msg);
          this.msg = 'error';
        }
      }
    );
  }
}
