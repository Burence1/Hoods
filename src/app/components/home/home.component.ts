import { Hood } from './../../interfaces/hood/hood';
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
import { ProfileService } from 'src/app/services/profile/profile.service';
import { HomeService } from 'src/app/services/home/home.service';

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
  profile:any
  email:string

  sideBarOpen = false;

  images: any[] = []

  sideBarToggler() {
    this.sideBarOpen = !this.sideBarOpen;
  }
  
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  constructor(private Auth:AngularFireAuth,private db:AngularFireDatabase,
    private auth: AuthService,
    private breakpointObserver: BreakpointObserver,
    private service: HoodsService,private pservice:ProfileService,private hservice:HomeService) {
    this.Auth.authState.subscribe(auth => {
      if (auth !== undefined && auth !== null) {
        this.user = auth;
      }
      this.getUser().valueChanges().subscribe(a => {
        this.userName = a;
        this.data = this.userName.hood
               
      });
      this.hservice.getHood().subscribe(x => {
        const data = x
        console.log(this.data)
        this.hood = data.filter(x => x.title === this.data)
      })
      this.getHoods().subscribe(x => {
        const data = x
        this.images = data.map(x => x.image)
        console.log(this.images)
      })
    })
  }

  getHoods():Observable<Hood[]>{
    return this.db.list<Hood>('/hoods').valueChanges();
  }

  getUser() {
    const userId = this.user.uid;
    const path = `/users/${userId}`;
    return this.db.object(path);
  }

  ngOnInit(): void {

  }

  logout() {
    this.auth.logout();
  }
}
