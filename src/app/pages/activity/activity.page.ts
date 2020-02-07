import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { StorageService } from 'src/app/services/storage/storage.service';
import { Order, Item } from 'src/app/models/order.model';
import { ActivityService } from 'src/app/services/api-caller/activity/activity.service';
import { ActivityUpdationPage } from './activity-updation/activity-updation.page';
import { OverlayEventDetail } from '@ionic/core';
import { Router, NavigationEnd } from '@angular/router';
import { OrderDetail } from 'src/app/models/orderDetail.model';

@Component({
  selector: 'app-history',
  templateUrl: './activity.page.html',
  styleUrls: ['./activity.page.scss'],
})
export class ActivityPage implements OnInit {

  activityList: { today: Order[], tomorrow: Order[] };
  hasModalOpened = false;
  isLoading = true;

  constructor(
    private router: Router,
    private storage: StorageService,
    private activityService: ActivityService,
    private popoverController: PopoverController,
  ) { }

  ngOnInit() {
    // setInterval(() => this.getActivityList(), 7000);
    this.router.events.subscribe((value: NavigationEnd) => {
      if (value.urlAfterRedirects && value instanceof NavigationEnd) {
        if (value.urlAfterRedirects === '/main/activity') {
          this.getActivityList();
        }
      }
    });
    setInterval(() => this.getActivityList(), 10000);
    this.activityList = { today: [], tomorrow: [] };
  }

  async openUpdateModal(index: number, isToday: boolean) {
    if (this.hasModalOpened) {
      return;
    }
    this.hasModalOpened = true;
    const order = (isToday ? this.activityList.today[index] : this.activityList.tomorrow[index]);
    const activityDetail = await this.activityService.getActivityDetail(order.orderId);
    const popover = await this.popoverController.create({
      component: ActivityUpdationPage,
      componentProps: { activityDetail: activityDetail[0] },
      cssClass: 'update-popover'
    });

    popover.style.backgroundColor = 'rgba(0, 0, 0, 0.29)';

    await popover.present();

    popover.onDidDismiss()
      .then((ret: OverlayEventDetail<{ command: string, activityDetail: OrderDetail }>) => {
        if (ret.data.command === 'done') {
          this.activityService.orderDone(ret.data.activityDetail._id);
        } else if (ret.data.command === 'complete') {
          this.activityService.orderComplete(ret.data.activityDetail._id);
        }
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {
        this.getActivityList();
        this.hasModalOpened = false;
      });
  }

  async getActivityList(event?) {
    try {
      this.isLoading = true;
      const uid = (await this.storage.getUserInfo()).uid;
      this.activityList = await this.activityService.getActivityList(uid);
      this.isLoading = false;
      if (event) {
        event.target.complete();
      }
    } catch (err) {
      console.log(err);
    }
  }

  getStateText(state: string) {
    switch (state) {
      case 'cf': return 'Confirmed';
      case 'cd': return 'Ready for deliver';
      default: return 'State error';
    }
  }

  getStateColor(state: string) {
    switch (state) {
      case 'cf': return 'brownred';
      case 'cd': return 'successgreen';
      default: return 'danger';
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
