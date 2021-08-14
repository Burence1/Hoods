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

  user$: Observable<firebase.User>;
  private authState: any;
  currentId: any;

  constructor(private db:AngularFireDatabase,private router:Router,private afAuth:AngularFireAuth) { 
    this.user$ = afAuth.authState;
  }

  authUser() {
    return this.user$;
  }

  // email & password login
  login(email: string, password: string) {
    this.afAuth.signInWithEmailAndPassword(email, password)
      .then((value) => {
        if (!value.user.emailVerified) {
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

  emailSignup(displayName: string, email: string, password: string, confirmPassword: string) {
    this.afAuth.createUserWithEmailAndPassword(email, password)
      .then(async (user: firebase.auth.UserCredential) => {
        await firebase.auth().currentUser.sendEmailVerification();
        this.authState = user;
        const currentId = this.authState.user.uid;
        const status = 'online';
        this.setUserData(email, displayName, status, currentId);
        this.router.navigateByUrl('/login');
      })
      .catch((error: any) => {
        console.log('Something went wrong: ', error);
      });
  }

  // move user data to real-time database
  setUserData(email: string, displayName: string, status: string, currentId: any): void {
    const path = `users/${currentId}`;
    const data = {
      email,
      displayName,
      status
    };
    this.db.object(path).update(data)
      .catch(error => console.log(error));
  }

  // email signup/login
  googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.oAuthLogin(provider)
      .then((value: firebase.auth.UserCredential) => {
        console.log('Success', value), this.router.navigateByUrl('/home');
        const currentId = value.user.uid;
        const status = 'online';
        this.setUserData(value.user.email, value.user.displayName, status, currentId);
      })
      .catch((error: any) => {
        console.log('Something went wrong: ', error);
      });
  }

  // reset password logic
  resetPassword(email: string) {
    return firebase
      .auth()
      .sendPasswordResetEmail(email)
      .then((value: any) => {
        console.log('We have sent you a password reset link');
        this.router.navigateByUrl('/login');
      })
      .catch((err: { message: any }) => {
        console.log('Something went wrong: ', err.message);
      });
  }

  // logout
  logout() {
    this.afAuth.signOut().then(() => {
      console.log('signOut successful');
      this.router.navigate(['/login']);
      return 'You have been signed out.';
    });
  }

  private oAuthLogin(provider: any) {
    return this.afAuth.signInWithPopup(provider);
  }
}