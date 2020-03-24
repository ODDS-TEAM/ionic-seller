import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HistoryPageRoutingModule } from './history-routing.module';

import { HistoryPage } from './history.page';
import { HistoryDetailComponent } from './history-detail/history-detail.component';
import { TimeAgoThaiPipeModule } from 'src/app/pipes/timeAgoThai/time-ago-thai.pipe.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HistoryPageRoutingModule,
    TimeAgoThaiPipeModule
  ],
  declarations: [HistoryPage, HistoryDetailComponent],
  entryComponents: [HistoryDetailComponent]
})
export class HistoryPageModule {}
