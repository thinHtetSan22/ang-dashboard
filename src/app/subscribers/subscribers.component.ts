import { Component, OnInit } from '@angular/core';
import { SubscribersService } from '../services/subscribers.service';

@Component({
  selector: 'app-subscribers',
  templateUrl: './subscribers.component.html',
  styleUrl: './subscribers.component.css'
})
export class SubscribersComponent implements OnInit{
  subscribersArray: Array<any> = [];

  constructor( private subService: SubscribersService){}

  ngOnInit(): void {
    this.subService.loadData().subscribe(val => {
      this.subscribersArray = val;
    })
  }

  onDelete(id: any ){
    this.subService.deleteData(id);
  }

}
