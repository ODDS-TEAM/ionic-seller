import { Component, OnInit } from '@angular/core';
import { ScheduleService } from 'src/app/services/api-caller/schedule/schedule.service';
import { Menu } from 'src/app/models/schedule.model';
import { PopoverController, ToastController } from '@ionic/angular';
import { AddFoodPage } from './add-food/add-food.page';
import { OverlayEventDetail } from '@ionic/core';
import { DeleteConfirmPage } from './delete-confirm/delete-confirm.page';
import { Router } from '@angular/router';

@Component({
  selector: 'app-table',
  templateUrl: './schedule.page.html',
  styleUrls: ['./schedule.page.scss'],
})
export class SchedulePage implements OnInit {

  days = [
    {
      name: 'Monday',
      code: 'mon'
    }, {
      name: 'Tuesday',
      code: 'tue'
    }, {
      name: 'Wednesday',
      code: 'wed'
    }, {
      name: 'Thursday',
      code: 'thu'
    }, {
      name: 'Friday',
      code: 'fri'
    }
  ];
  listMenus: { mon: Menu[], tue: Menu[], wed: Menu[], thu: Menu[], fri: Menu[] };

  constructor(
    private popoverController: PopoverController,
    private scheduleService: ScheduleService,
    private toastController: ToastController,
    private router: Router,
  ) { }

  ngOnInit() {
    this.listMenus = { mon: [], tue: [], wed: [], thu: [], fri: [] };
    this.getScheduleList();
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  async getScheduleList() {
    try {
      this.listMenus = await this.scheduleService.getSchedule();
    } catch (err) {
      console.log(err);
    }
  }

  listOfFoodId(day: string) {
    const foodIds = [];
    for (const menu of this.listMenus[day]) {
      foodIds.push(menu.foodMenuId);
    }
    console.log(foodIds);
    return foodIds;
  }

  async addDayMenuPopover(day: string) {
    const popover = await this.popoverController.create({
      component: AddFoodPage,
      componentProps: {
        edit: false,
        day,
        foodIdList: this.listOfFoodId(day),
        foodLeft: 0,
        foodId: '',
        dayMenuId: ''
      },
      cssClass: 'add-food-popover'
    });

    popover.onDidDismiss().then((value: OverlayEventDetail) => {
      if (value.role === 'add') {
        const data = value.data;
        this.scheduleService.addSchedule(day, data.foodMenuId, data.menuName, data.foodLeft, data.imageUrl, data.price)
          .finally(() => this.getScheduleList());
      }
    });

    await popover.present();

    console.log(day);
  }

  async onTrashClick(dayMenuIndex: number, day: string) {
    const popover = await this.popoverController.create({
      component: DeleteConfirmPage,
      cssClass: 'delete-schedule-popover'
    });

    popover.onDidDismiss().then((value: OverlayEventDetail) => {
      if (value.role === 'delete') {
        this.deleteDaymenu(dayMenuIndex, day);
      }
    });

    await popover.present();
  }

  deleteDaymenu(dayMenuIndex: number, day: string) {
    this.scheduleService.deleteSchedule(this.listMenus[day][dayMenuIndex]._id)
      .then(success => {
        if (success) {
          this.getScheduleList();
        } else {
          this.presentToast('Error while delete scheduled menu.');
        }
      });
  }

  async openEditPopover(day: string, foodId: string, dayMenuId: string, foodLeft: number) {
    console.log(day, foodId, dayMenuId, foodLeft);
    const popover = await this.popoverController.create({
      component: AddFoodPage,
      componentProps: {
        edit: true,
        day,
        foodIdList: this.listOfFoodId(day),
        foodLeft,
        foodId,
        dayMenuId
      },
      cssClass: 'add-food-popover'
    });

    popover.onDidDismiss().then((value: OverlayEventDetail) => {
      if (value.role === 'edit') {
        const data = value.data;
        this.scheduleService.editSchedule(day, data.dayMenuId, data.foodMenuId, data.menuName, data.foodLeft, data.imageUrl, data.price)
          .finally(() => this.getScheduleList());
      }
    });

    await popover.present();
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000
    });
    toast.present();
  }
}
