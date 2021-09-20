import { DirectoryService } from './../../services/directory/directory.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import firebase from 'firebase/app';
import 'firebase/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-directory',
  templateUrl: './directory.component.html',
  styleUrls: ['./directory.component.css']
})
export class DirectoryComponent implements OnInit {

  user:any
  profiles:any[]
  hood:string
  userdata:any

  sideBarOpen = true;

  sideBarToggler() {
    this.sideBarOpen = !this.sideBarOpen;
  }

  constructor(private service:DirectoryService,private Auth:AngularFireAuth,private db:AngularFireDatabase) {
    this.Auth.authState.subscribe(auth => {
      if (auth !== undefined && auth !== null) {
        this.user = auth;
      }
      this.service.getUser().valueChanges().subscribe(x =>{
        this.userdata = x
        this.hood = this.userdata.hood
      })
      this.getProfiles()
    });
   }

  getProfiles() {
    this.service.getProfiles().subscribe(x => {
      const data = x
      this.profiles = data.filter(x => x.hood === this.hood)
      console.log(this.profiles)
    })
  }

  ngOnInit(): void {
  }
}