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
import { ProfileService } from '../profile/profile.service';
import { Hood } from 'src/app/interfaces/hood/hood';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  user: any;
  userData:any
  username:string
  occupant:string
  email:string

  constructor(private pservice: ProfileService, private Auth: AngularFireAuth, private db:AngularFireDatabase) {
    this.Auth.authState.subscribe(auth => {
      if (auth !== undefined && auth !== null) {
        this.user = auth;
      }
      this.getUser().valueChanges().subscribe(res => {
        this.userData = res;
        this.username = this.userData.displayName
        this.occupant = this.userData.hood;
        this.email = this.userData.email
      });
    });
  }

  getUser() {
    const userId = this.user.uid;
    const path = `/users/${userId}`;
    return this.db.object(path);
  }

  getHood():Observable<Hood[]>{
    return this.db.list<Hood>('/hoods').valueChanges()
  }
}
