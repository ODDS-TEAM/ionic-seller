import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { OrderConfirmationPage } from './order-confirmation/order-confirmation.page';
import { StorageService } from 'src/app/services/storage/storage.service';
import { OrderService } from 'src/app/services/api-caller/order/order.service';
import { Order, Item } from 'src/app/models/order.model';
import { OverlayEventDetail } from '@ionic/core';
import { OrderDetail } from 'src/app/models/orderDetail.model';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-order',
  templateUrl: './order.page.html',
  styleUrls: ['./order.page.scss'],
})
export class OrderPage implements OnInit {

  orderList: { today: Order[], tomorrow: Order[] };
  hasModalOpened = false;
  isLoading = true;

  constructor(
    private router: Router,
    private popoverController: PopoverController,
    private storage: StorageService,
    private orderService: OrderService
  ) { }

  ngOnInit() {
    this.router.events.subscribe((value: NavigationEnd) => {
      if (value.urlAfterRedirects && value instanceof NavigationEnd) {
        if (value.urlAfterRedirects === '/main/order') {
          this.getOrderList();
        }
      }
    });
    setInterval(() => this.getOrderList(), 10000);
    this.orderList = { today: [], tomorrow: [] };
  }

  async openConfirmationModal(index: number, isToday: boolean) {
    if (this.hasModalOpened) {
      return;
    }
    this.hasModalOpened = true;
    const order = (isToday ? this.orderList.today[index] : this.orderList.tomorrow[index]);
    const orderDetail = await this.orderService.getOrderDetail(order.orderId);
    const popover = await this.popoverController.create({
      component: OrderConfirmationPage,
      componentProps: { orderDetail },
      cssClass: 'update-popover'
    });

    popover.style.backgroundColor = 'rgba(0, 0, 0, 0.29)';

    await popover.present();

    popover.onDidDismiss()
      .then((ret: OverlayEventDetail<{ command: string, orderDetail: OrderDetail }>) => {
        if (ret.data.command === 'reject') {
          this.orderService.rejectOrder(ret.data.orderDetail._id);
          this.getOrderList();
        } else if (ret.data.command === 'accept') {
          this.orderService.acceptOrder(ret.data.orderDetail._id);
          this.getOrderList();
        }
        this.hasModalOpened = false;
      })
      .catch(err => {
        console.log(err);
        this.hasModalOpened = false;
      });
  }

  async getOrderList(event?) {
    try {
      this.isLoading = true;
      const uid = await this.storage.getUid();
      this.orderList = await this.orderService.getOrderList(uid);
      this.isLoading = false;
      if (event) {
        event.target.complete();
      }
    } catch (err) {
      console.log(err);
    }
  }

  calcNumberOfFood(items: Item[]) {
    let sum = 0;
    for (const item of items) {
      sum += item.numberOfItem;
    }
    return sum;
  }

  joinFoodName(items: Item[]) {
    const arr = [];
    for (const item of items) {
      arr.push(item.foodName + ' ' + item.numberOfItem);
    }
    return arr.join(', ');
  }

}
