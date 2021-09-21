import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ErrorStateMatcher } from '@angular/material/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { ChatService } from 'src/app/services/chat/chat.service';
import { Router, ActivatedRoute } from '@angular/router';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
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

@Component({
  selector: 'app-chatfeed',
  templateUrl: './chatfeed.component.html',
  styleUrls: ['./chatfeed.component.css']
})
export class ChatfeedComponent implements OnInit {

  messageForm: FormGroup
  matcher = new MyErrorStateMatcher();
  chatname: string
  userData: any
  data: string
  user: any
  chats: any[];
  group: any[]
  groupname: string


  sideBarOpen = true;

  sideBarToggler() {
    this.sideBarOpen = !this.sideBarOpen;
  }

  constructor(private Auth: AngularFireAuth, private db: AngularFireDatabase,
    private formBuilder: FormBuilder, private service: ChatService, private route: ActivatedRoute) {
    this.Auth.authState.subscribe(auth => {
      if (auth !== undefined && auth !== null) {
        this.user = auth;
      }
      this.getUser().valueChanges().subscribe(a => {
        this.userData = a;
        this.data = this.userData.hood
        this.chatname = this.userData.displayName;
       
      });
      this.groupname = this.route.snapshot.params.groupname
      this.service.getMessages().subscribe(x => {
        const data = x
        this.chats = data.filter(x => x.groupname === this.groupname)
      })
    });
  }

  getUser() {
    const userId = this.user.uid;
    const path = `/users/${userId}`;
    return this.db.object(path);
  }

  ngOnInit(): void {
    this.messageForm = this.formBuilder.group({
      message: [null, Validators.required],
    })
  }

  newMessage(form: any) {
    const data = form
    data.groupname = this.groupname
    this.service.sendMessage(data)
  }
}