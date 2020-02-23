import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SchedulePageRoutingModule } from './schedule-routing.module';

import { SchedulePage } from './schedule.page';
import { FoodCardComponent } from 'src/app/components/food-card/food-card.component';
import { WeekMenusService } from 'src/app/services/api-caller/week-menus/week-menus.service';
import { AddFoodPageModule } from './add-food/add-food.module';
import { DeleteConfirmPageModule } from './delete-confirm/delete-confirm.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SchedulePageRoutingModule,
    AddFoodPageModule,
    DeleteConfirmPageModule
  ],
  declarations: [SchedulePage, FoodCardComponent],
  providers: [WeekMenusService]
})
export class SchedulePageModule {}
