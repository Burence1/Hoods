import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import firebase from 'firebase/app';
import 'firebase/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { Convolist } from 'src/app/interfaces/convolist/convolist';
import { Chat } from 'src/app/interfaces/chat/chat';

export const snapshotToArray = (snapshot: any) => {
  const returnArr: any[] = [];

  snapshot.forEach((childSnapshot: any) => {
    const item = childSnapshot.val();
    item.key = childSnapshot.key;
    returnArr.push(item);
  });

  return returnArr;
};

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  user: any;
  username: string;
  occupant: any;
  hood: any;
  userData: any;
  ref: any;
  img: any;
  data:any;
  chatname:string
  userHood:any

  constructor(private db: AngularFireDatabase,
    private Auth: AngularFireAuth, private router: Router,
    private snackBar: MatSnackBar, private storage: AngularFireStorage) {
    this.Auth.authState.subscribe(auth => {
      if (auth !== undefined && auth !== null) {
        this.user = auth;
      }
      this.getUser().valueChanges().subscribe(a => {
        this.userData = a;
        this.data = this.userData.hood
        this.chatname = this.userData.displayName;
      });
    });
  }
  getUser() {
    const userId = this.user.uid;
    const path = `/users/${userId}`;
    return this.db.object(path);
  }
  
  getConvoList():Observable<Convolist[]>{
    return this.db.list<Convolist>('/chatgroups').valueChanges()
  }

  getMessages():Observable<Chat[]>{
    return this.db.list<Chat>('/chats').valueChanges()
  }

  createGroup(form: any, selectedImage: any) {
    this.ref = firebase.database().ref('chatgroups/');
    var name = selectedImage.name;
    const path = `groups/${name}`
    const fileRef = this.storage.ref(path);
    this.storage.upload(path, selectedImage).snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe((url) => {
          const group = form;
          group.admin = this.chatname;
          this.img = url;
          group.image = this.img
          group.hood = this.data

          this.ref.orderByChild('title').equalTo(group.title).once('value', (snapshot: any) => {
            if (snapshot.exists()) {
              this.snackBar.open('Group already exist!', 'undo', {
                duration: 2000
              });
            } else {
              const newGroup = firebase.database().ref('chatgroups/').push();
              newGroup.set(group);
            }
          });
        })
      })
    ).subscribe();
  }

  sendMessage(form: any) {
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
    var dateTime = date + ' ' + time;

    const chat = form;
    chat.chatname = this.chatname;
    chat.date = dateTime;
    const newMessage = firebase.database().ref('chats/').push();
    newMessage.set(chat);
  }
}
