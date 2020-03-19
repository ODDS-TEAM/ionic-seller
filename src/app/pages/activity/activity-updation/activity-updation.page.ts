import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { OrderDetail } from 'src/app/models/orderDetail.model';

@Component({
  selector: 'app-activity-updation',
  templateUrl: './activity-updation.page.html',
  styleUrls: ['./activity-updation.page.scss'],
})
export class ActivityUpdationPage implements OnInit {

  @Input() activityDetail: OrderDetail;
  totalPrice = 0;

  constructor(
    private modalController: ModalController
  ) { }

  ngOnInit() {
    // setTimeout(() => this.modalController.dismiss(), 20000);
    for (const item of this.activityDetail.items) {
      this.totalPrice += item.price * item.numberOfItem;
    }
  }

  updateOrder() {
    switch (this.activityDetail.state) {
      case 'cf':
        this.modalController.dismiss({
          command: 'done',
          activityDetail: this.activityDetail
        });
        break;
      case 'cd':
        this.modalController.dismiss({
          command: 'complete',
          activityDetail: this.activityDetail
        });
        break;
    }
  }

  closeModal() {
    this.modalController.dismiss();
  }

  transformDateTime(dateTime) {
    if (!(dateTime instanceof Date)) {
      dateTime = new Date(dateTime);
    }
    const date = dateTime.getDate();
    const month = dateTime.getMonth() + 1;
    const year = dateTime.getFullYear();
    const hour = dateTime.getHours().toString().padStart(2, '0');
    const minute = dateTime.getMinutes().toString().padStart(2, '0');
    return `${date}/${month}/${year} ${hour}:${minute}`;
  }
}
