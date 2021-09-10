import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import firebase from 'firebase/app';
import 'firebase/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Profile } from 'src/app/interfaces/profile/profile';

@Injectable({
  providedIn: 'root'
})
export class DirectoryService {

  user: any
  userData: any
  data: string
  username: string
  profiles: any[]

  constructor(private db: AngularFireDatabase,
    private Auth: AngularFireAuth, private router: Router,
    private snackBar: MatSnackBar) {
    this.Auth.authState.subscribe(auth => {
      if (auth !== undefined && auth !== null) {
        this.user = auth;
      }
    });
  }
  getUser() {
    const userId = this.user.uid;
    const path = `/users/${userId}`;
    return this.db.object(path);
  }

  getProfiles(): Observable<Profile[]> {
    return this.db.list<Profile>('/users').valueChanges()
  }
}