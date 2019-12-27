import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TablePageRoutingModule } from './table-routing.module';

import { TablePage } from './table.page';
import { FoodCardComponent } from 'src/app/components/food-card/food-card.component';
import { WeekMenusService } from 'src/app/services/week-menus/week-menus.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TablePageRoutingModule
  ],
  declarations: [TablePage,FoodCardComponent],
  providers: [WeekMenusService]
})
export class TablePageModule {}
