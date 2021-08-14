import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase/app';
import 'firebase/auth';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user$: Observable<firebase.User|null>;
  private authState: any;
  currentId: any;

  constructor(private db:AngularFireDatabase,private router:Router,private afAuth:AngularFireAuth) { 
    this.user$ = afAuth.authState;
  }

  authUser() {
    return this.user$;
  }

  login(email: string, password: string) {
    this.afAuth.signInWithEmailAndPassword(email, password)
      .then((value) => {
        if (!value.user?.emailVerified) {
          console.log('Please verify your email to login');
        }
        else {
          this.router.navigateByUrl('/home');
        }
      })
      .catch((err: { message: any }) => {
        console.log('Something went wrong: ', err.message);
      });
  }
}
