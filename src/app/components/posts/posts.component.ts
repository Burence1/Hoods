import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ErrorStateMatcher } from '@angular/material/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { Router, ActivatedRoute } from '@angular/router';
import { PostsService } from 'src/app/services/posts/posts.service';
import { ProfileService } from 'src/app/services/profile/profile.service';

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
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {

  matcher = new MyErrorStateMatcher();
  postForm: FormGroup
  user:any
  selectedImage: any = null;
  userData:any
  chatname:string
  hood:string
  postData:any[]
  profile:any[]
  email: string
  data:any

  constructor(private pservice:ProfileService,
    private Auth: AngularFireAuth, private db: AngularFireDatabase, private service: PostsService,
    private formBuilder: FormBuilder, private route: ActivatedRoute
  ) { 
    this.Auth.authState.subscribe(auth => {
      if (auth !== undefined && auth !== null) {
        this.user = auth;
      }
      this.getUser().valueChanges().subscribe(a => {
        this.userData = a;
        this.hood = this.userData.hood
        this.email = this.userData.email
        this.chatname = this.userData.displayName;
      });
      this.service.getPosts().subscribe(x => {
        const data = x
        this.postData = data.filter(x => x.hood === this.hood)
      })
    });
  }

  getUser() {
    const userId = this.user.uid;
    const path = `/users/${userId}`;
    return this.db.object(path);
  }

  getProfile(){
    this.pservice.getProfile().subscribe(x=>{
      const profile = x
      this.profile = profile.filter(x => x.email === this.email)
    })
  }

  // getPosts(){
  //   this.service.getPosts().subscribe(x => {
  //     const data = x
  //     this.postData = data.filter(x => x.hood === this.profile[0].hood)
  //   })
  // }

  ngOnInit(): void {
    this.postForm = this.formBuilder.group({
      title: [null, Validators.required],
      content: [null, Validators.required],
      image: [null, Validators.required],
    });
    this.getProfile()
    // this.getPosts()
  }

  newPost(form: any) {
    const data = form
    this.service.addPost(data, this.selectedImage)
  }

  showPreview(event: any) {
    this.selectedImage = event.target.files[0];
  }
}