import { Component, OnInit } from '@angular/core';
import { Events } from '@ionic/angular';
import { EventBadgeService } from '../services/event/event.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit {

  activityNumber = 0;
  orderNumber = 0;

  constructor(private events: Events) {}

  ngOnInit(): void {
    this.events.subscribe(EventBadgeService.ACTIVITY_NUMBER_TOPIC, num => {
      this.activityNumber = num;
    });
    this.events.subscribe(EventBadgeService.ORDER_NUMBER_TOPIC, num => {
      this.orderNumber = num;
    });
  }

}
