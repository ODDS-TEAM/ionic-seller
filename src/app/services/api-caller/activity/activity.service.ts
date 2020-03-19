import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Order } from 'src/app/models/order.model';
import { OrderDetail } from 'src/app/models/orderDetail.model';
import { EventBadgeService } from '../../event/event.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {

  private ACTIVITY_URL = `${environment.apiUrl}/merchant/activity`;
  private ORDER_URL = `${environment.apiUrl}/merchant/food/order`;
  private ACTIVITY_ALL_URL = `${this.ACTIVITY_URL}/all`;
  private ORDER_DONE_COOKING = `${this.ORDER_URL}/done`;
  private ORDER_COMPLETE = `${this.ORDER_URL}/complete`;

  constructor(
    private http: HttpClient,
    private eventBadge: EventBadgeService,
  ) { }

  getActivityList(merchantId: string): Promise<{ today: Order[], tomorrow: Order[] }> {
    // return new Promise((resolve, reject) => {
    //   resolve({ today: [], tomorrow: [] });
    // });
    return new Promise((resolve, reject) => {
      this.http.request<Order[]>('GET', `${this.ACTIVITY_ALL_URL}/${merchantId}`,
        {
          observe: 'response'
        })
        .subscribe(
          res => {
            if (res.status === 200) {
              const today: Order[] = [];
              const tomorrow: Order[] = [];

              for (const order of res.body) {
                order.dateTime = new Date(order.dateTime);
                today.push(order);
              }

              this.eventBadge.updateActivityNumber(today.length + tomorrow.length);
              console.log(today);
              resolve({ today: today.reverse(), tomorrow: tomorrow.reverse() });
            } else {
              reject(res);
            }
          }, err => {
            if (err.status === 401) {
              this.eventBadge.updateActivityNumber(0);
              resolve({ today: [], tomorrow: [] });
            } else {
              reject(err);
            }
          }
        );
    });
  }

  getActivityDetail(activityId: string): Promise<OrderDetail> {
    return new Promise((resolve, reject) => {
      this.http.request<OrderDetail>('GET', `${this.ACTIVITY_URL}/${activityId}`,
        {
          observe: 'response'
        })
        .subscribe(
          res => {
            if (res.status === 200) {
              resolve(res.body);
            } else {
              reject(res);
            }
          }, err => {
            reject(err);
          }
        );
    });
  }

  orderDone(activityId: string) {
    return new Promise((resolve, reject) => {
      this.http.request('POST', `${this.ORDER_DONE_COOKING}/${activityId}`,
        {
          observe: 'response',
        })
        .subscribe(
          res => {
            if (res.status === 200) {
              resolve();
            } else {
              reject(res);
            }
          }, err => {
            reject(err);
          }
        );
    });
  }

  orderComplete(activityId: string) {
    return new Promise((resolve, reject) => {
      this.http.request('POST', `${this.ORDER_COMPLETE}/${activityId}`,
        {
          observe: 'response',
        })
        .subscribe(
          res => {
            if (res.status === 200) {
              resolve();
            } else {
              reject(res);
            }
          }, err => {
            reject(err);
          }
        );
    });
  }
}
