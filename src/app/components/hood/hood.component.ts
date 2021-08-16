import { Component, OnInit } from '@angular/core';
import { HoodsService } from 'src/app/services/hoods/hoods.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-hood',
  templateUrl: './hood.component.html',
  styleUrls: ['./hood.component.css']
})
export class HoodComponent implements OnInit {

  constructor(private service:HoodsService) { }

  ngOnInit(): void {
  }

  newHood(form:any){
    const data = form
    this.service.addHood(data)
  }

  getHood(){
    this.service.getHood()
  }

  currentUser(){
    this.service.getUser()
  }

}
