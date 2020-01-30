import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Events } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ActivityBadgeService {

  constructor(private events: Events) {
  }

  updateActivityNumber(num: number) {
    this.events.publish('badge:activity-number', num);
  }

  updateOrderNumber(num: number) {
    this.events.publish('badge:order-number', num);
  }
}
