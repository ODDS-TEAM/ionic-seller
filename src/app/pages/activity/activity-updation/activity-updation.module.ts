import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ActivityUpdationPage } from './activity-updation.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  declarations: [ActivityUpdationPage],
  entryComponents: [ActivityUpdationPage]
})
export class ActivityUpdationPageModule {}
