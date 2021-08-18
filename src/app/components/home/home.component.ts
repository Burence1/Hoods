import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth/auth.service';
import { AngularFireStorage } from '@angular/fire/storage';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { HoodsService } from 'src/app/services/hoods/hoods.service';

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
  user:Observable<any>;
  currentHood:any;
  hoodData:any;
  hood:any[];
  title:any;
  
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  constructor(
    private auth: AuthService,
    private breakpointObserver: BreakpointObserver,
    private service: HoodsService) {
    
    }


  ngOnInit(): void {
    firebase.database().ref('hoods/').on('value', resp => {
      const hoodData = snapshotToArray(resp);
      this.hood = hoodData.filter(x => x.title === 'moringa');
      console.log(this.hood)
    });
    
    // this.title = this.hood.title
  }
  
  // getHood() {
  //   this.currentHood = this.service.getHood()
  // }

  logout() {
    this.auth.logout();
  }
}
