import { Component, OnInit } from '@angular/core';
import { ScheduleService } from 'src/app/services/api-caller/schedule/schedule.service';
import { Menu } from 'src/app/models/schedule.model';
import { PopoverController } from '@ionic/angular';
import { AddFoodPage } from './add-food/add-food.page';
import { OverlayEventDetail } from '@ionic/core';

@Component({
  selector: 'app-table',
  templateUrl: './schedule.page.html',
  styleUrls: ['./schedule.page.scss'],
})
export class SchedulePage implements OnInit {

  listMenus: { mon: Menu[], tue: Menu[], wed: Menu[], thu: Menu[], fri: Menu[] };

  constructor(
    private popoverController: PopoverController,
    private scheduleService: ScheduleService
  ) { }

  ngOnInit() {
    this.listMenus = { mon: [], tue: [], wed: [], thu: [], fri: [] };
    this.getScheduleList();
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
}
