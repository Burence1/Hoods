import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth/auth.service';
import { AngularFireStorage } from '@angular/fire/storage';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { HoodsService } from 'src/app/services/hoods/hoods.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';

export const snapshotToArray = (snapshot: any) => {
  const returnArr: any[] = [];

  snapshot.forEach((childSnapshot: any) => {
    const item = childSnapshot.val();
    item.key = childSnapshot.key;
    returnArr.push(item);
  });

  return returnArr;
};

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  user: any;
  currentHood:any;
  hoodData:any;
  hood:any[];
  title:any;
  userName:any
  chatname:any
  myHood:any
  data:any
  
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  constructor(private Auth:AngularFireAuth,private db:AngularFireDatabase,
    private auth: AuthService,
    private breakpointObserver: BreakpointObserver,
    private service: HoodsService) {
    this.Auth.authState.subscribe(auth => {
      if (auth !== undefined && auth !== null) {
        this.user = auth;
      }
      this.getUser().valueChanges().subscribe(a => {
        this.userName = a;
        this.data = this.userName.hood
        console.log(this.data)
        this.chatname = this.userName.displayName;
        
        firebase.database().ref('hoods/').on('value', resp => {
          const hoodData = snapshotToArray(resp);
          this.hood = hoodData.filter(x => x.title === this.data);
          console.log(this.hood)
        });
        
      });
    
    })
    
  }

  getUser() {
    const userId = this.user.uid;
    const path = `/users/${userId}`;
    return this.db.object(path);
  }

  ngOnInit(): void {

  }
  
  // getHood() {
  //   this.currentHood = this.service.getHood()
  // }

  logout() {
    this.auth.logout();
  }
}
