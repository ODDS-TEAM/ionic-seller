import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'food-card',
  templateUrl: './food-card.component.html',
  styleUrls: ['./food-card.component.scss'],
})
export class FoodCardComponent implements OnInit {

  @Input() private imgUrl: string = '';
  @Input() private name: string = 'ชื่ออาหาร';
  @Input() private limit: number = 100;

  constructor() { }

  ngOnInit() {}

}
