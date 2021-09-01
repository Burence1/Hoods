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

  constructor(private Auth: AngularFireAuth, private db: AngularFireDatabase,
    private formBuilder: FormBuilder, private service: ChatService, private route: ActivatedRoute) {
    this.Auth.authState.subscribe(auth => {
      if (auth !== undefined && auth !== null) {
        this.user = auth;
      }
      this.getUser().valueChanges().subscribe(a => {
        this.userData = a;
        this.data = this.userData.hood
        console.log(this.data)
        this.chatname = this.userData.displayName;


        this.groupname = this.route.snapshot.params.name;
        console.log(this.groupname)
        firebase.database().ref('chats/').on('value', resp => {
          const chats = snapshotToArray(resp);
          this.chats = chats.filter(x => x.hood === this.groupname);
          console.log(this.chats);
        });
        this.groupname = this.route.snapshot.params.name;
        firebase.database().ref('chatgroups/').on('value', resp => {
          console.log(this.groupname)
          const data = snapshotToArray(resp);
          this.group = data.filter(x => x.hood === this.groupname);
          console.log(this.group);
        });
      });
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
    this.service.sendMessage(data)
  }

}
