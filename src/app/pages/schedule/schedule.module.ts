import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SchedulePageRoutingModule } from './schedule-routing.module';

import { SchedulePage } from './schedule.page';
import { FoodCardComponent } from 'src/app/components/food-card/food-card.component';
import { WeekMenusService } from 'src/app/services/week-menus/week-menus.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SchedulePageRoutingModule
  ],
  declarations: [SchedulePage, FoodCardComponent],
  providers: [WeekMenusService]
})
export class SchedulePageModule {}
