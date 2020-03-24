import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { HistoryDetail } from 'src/app/models/history.model';

@Component({
  selector: 'app-history-detail',
  templateUrl: './history-detail.component.html',
  styleUrls: ['./history-detail.component.scss'],
})
export class HistoryDetailComponent implements OnInit {

  @Input() historyDetail: HistoryDetail;
  totalPrice: number;
  headerTitle: string[];

  constructor(
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.calculateTotalPrice();
    this.convertDateTimeToHeaderString();
  }

  convertDateTimeToHeaderString() {
    const date = this.historyDetail.dateTime;
    this.headerTitle = [
      [date.getDate(), date.getMonth() + 1, date.getFullYear()].join('/')
      , date.getHours() + ':' + date.getMinutes()
    ];
  }

  closeModal() {
    this.modalController.dismiss();
  }

  calculateTotalPrice() {
    this.totalPrice = 0;
    this.historyDetail.items.forEach(ele => {
      this.totalPrice += ele.price * ele.numberOfItem;
    });
  }

  getBadgeColor(state: string) {
    console.log(state);
    switch (state) {
      case 'cp': return 'waitinggray';
      case 'cc': return 'danger';
    }
  }

  getBadgeText(state: string) {
    switch (state) {
      case 'cp': return 'Success';
      case 'cc': return 'Cancel';
    }
  }

  onPressCloseIcon() {
    this.closeModal();
  }

}
