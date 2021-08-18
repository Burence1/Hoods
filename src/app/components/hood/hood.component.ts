import { Component, OnInit } from '@angular/core';
import { HoodsService } from 'src/app/services/hoods/hoods.service';
import { Observable } from 'rxjs';
import { ErrorStateMatcher } from '@angular/material/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';


export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}


@Component({
  selector: 'app-hood',
  templateUrl: './hood.component.html',
  styleUrls: ['./hood.component.css']
})

export class HoodComponent implements OnInit {

  
  hoodForm: FormGroup
  matcher = new MyErrorStateMatcher();
  imageInput: string;
  selectedImage: any = null;
  file:string;

  constructor(private service:HoodsService,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.hoodForm = this.formBuilder.group({
      title: [null, Validators.required],
      description: [null, Validators.required],
      location:[null,Validators.required],
      image:[null,Validators.required],
    });
  }

  newHood(form:any){
    const data = form
    this.service.addHood(data,this.selectedImage)
  }

  getHood(){
    this.service.getHood()
  }

  currentUser(){
    this.service.getUser()
  }

  showPreview(event: any) {
    this.selectedImage = event.target.files[0];
  }


}
