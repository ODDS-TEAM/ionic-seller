import { Component, OnInit } from '@angular/core';
import { HistoryService } from 'src/app/services/api-caller/history/history.service';
import { History, HistoryDetail } from 'src/app/models/history.model';
import { ModalController, LoadingController } from '@ionic/angular';
import { HistoryDetailComponent } from './history-detail/history-detail.component';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements OnInit {

  historyList: History[];

  constructor(
    private historyService: HistoryService,
    private modalController: ModalController,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
    this.getHistoryList();
  }

  getHistoryList() {
    this.historyService.getHistoryList().then(historyList => {
      this.historyList = historyList;
    });
  }

  joinFoodName(items: { foodName: string }[]) {
    const names = items.map(ele => ele.foodName);
    return names.join(', ');
  }

  dateToString(date: Date) {
    return [date.getDate(), date.getMonth() + 1, date.getFullYear()].join('/');
  }

  async onPressHistoryItem(index: number) {
    const loading = await this.presentLoading();
    this.historyService.getHistoryDetail(this.historyList[index].orderId).then(async historyDetail => {
      const modal = await this.modalController.create({
        component: HistoryDetailComponent,
        componentProps: {
          historyDetail
        }
      });
      await modal.present();
      await loading.dismiss();
    });
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      spinner: 'bubbles'
    });
    await loading.present();
    return loading;
  }

}
