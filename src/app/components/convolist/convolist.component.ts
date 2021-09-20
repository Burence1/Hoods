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
import { ActivatedRoute, Router } from '@angular/router';

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
  selector: 'app-convolist',
  templateUrl: './convolist.component.html',
  styleUrls: ['./convolist.component.css']
})
export class ConvolistComponent implements OnInit {

  selectedImage: any = null;
  convoForm: FormGroup
  matcher = new MyErrorStateMatcher();
  user: any;
  userData: any;
  data: string
  chatname: string
  groups: any[]
  isLoadingResults = true;

  sideBarOpen = true;

  sideBarToggler() {
    this.sideBarOpen = !this.sideBarOpen;
  }


  constructor(private Auth: AngularFireAuth, private db: AngularFireDatabase, private service: ChatService,
    private formBuilder: FormBuilder, private router: Router) {
    this.Auth.authState.subscribe(auth => {
      if (auth !== undefined && auth !== null) {
        this.user = auth;
      }
      this.getUser().valueChanges().subscribe(a => {
        this.userData = a;
        this.data = this.userData.hood
        console.log(this.data)
        this.chatname = this.userData.displayName;

        this.service.getConvoList().subscribe(x => {
          const data = x
          this.groups = data.filter(x => x.hood === this.data)
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
    this.convoForm = this.formBuilder.group({
      title: [null, Validators.required],
      description: [null, Validators.required],
      image: [null, Validators.required],
    });
  }

  newGroup(form: any) {
    const data = form
    this.service.createGroup(data, this.selectedImage)
  }

  showPreview(event: any) {
    this.selectedImage = event.target.files[0];
  }

  enterChat(groupname:string){
    this.router.navigate(['/chatfeed',groupname]);
  }

}
