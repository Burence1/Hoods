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
  }

  getHood():Observable<Hood[]>{
    return this.db.list<Hood>('/hoods').valueChanges();
  }
}
