import { Injectable } from '@angular/core';
import { Order, Item } from '../../../models/order.model';
import { OrderDetail } from '../../../models/orderDetail.model';
import { HttpClient } from '@angular/common/http';
import { EventBadgeService } from '../../event/event.service';
import { WEB_SERVICE_URL } from '../../webServiceVariable';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private ORDER_MAIN_URL = `${WEB_SERVICE_URL}/merchant/food/order`;
  private ORDER_DETAIL_URL = this.ORDER_MAIN_URL + '/detail';
  private ORDER_REJECT_URL = this.ORDER_MAIN_URL + '/cancel';
  private ORDER_ACCEPT_URL = this.ORDER_MAIN_URL + '/confirm';

  constructor(private http: HttpClient, private eventBadge: EventBadgeService) { }

  acceptOrder(orderId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.http.request('POST', `${this.ORDER_ACCEPT_URL}/${orderId}`,
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

  rejectOrder(orderId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.http.request('POST', `${this.ORDER_REJECT_URL}/${orderId}`,
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

  getOrderList(merchantId: string): Promise<{ today: Order[], tomorrow: Order[] }> {
    return new Promise((resolve, reject) => {
      this.http.request<Order[]>('GET', `${this.ORDER_MAIN_URL}/${merchantId}`, { observe: 'response' })
        .subscribe(
          res => {
            const now = new Date();
            const yesterday = new Date();
            yesterday.setDate(now.getDate() - 1);

            const today: Order[] = [];
            const tomorrow: Order[] = [];

            for (const order of res.body) {
              order.dateTime = new Date(order.dateTime);
              if (order.dateTime.getDate() === yesterday.getDate()) {
                today.push(order);
              } else if (order.dateTime.getDate() === now.getDate()) {
                if (order.dateTime.getHours() < 13) {
                  today.push(order);
                } else {
                  // Normally push tomorrow
                  today.push(order);
                }
              }
            }

            this.eventBadge.updateOrderNumber(res.body.length);

            resolve({ today, tomorrow });
          }, err => {
            if (err.status === 401) {
              this.eventBadge.updateOrderNumber(0);
              resolve({ today: [], tomorrow: [] });
            } else {
              reject(err);
            }
          });

    });
  }

  getOrderDetail(orderId: string): Promise<OrderDetail> {
    return new Promise((resolve, reject) => {
      this.http.request('GET', `${this.ORDER_DETAIL_URL}/${orderId}`)
        .subscribe(
          (orderDetail: OrderDetail) => {
            orderDetail.dateTime = new Date(orderDetail.dateTime);
            resolve(orderDetail);
          }, err => {
            reject(err);
          }
        );
    });
  }
}
