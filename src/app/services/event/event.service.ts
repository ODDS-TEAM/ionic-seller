import { Injectable } from '@angular/core';
import { Events } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class EventBadgeService {

  static ACTIVITY_NUMBER_TOPIC = 'badge:activity-number';
  static ORDER_NUMBER_TOPIC = 'badge:order-number';

  constructor(private events: Events) {
  }

  updateActivityNumber(num: number) {
    this.events.publish(EventBadgeService.ACTIVITY_NUMBER_TOPIC, num);
  }

  updateOrderNumber(num: number) {
    this.events.publish(EventBadgeService.ORDER_NUMBER_TOPIC, num);
  }
}
