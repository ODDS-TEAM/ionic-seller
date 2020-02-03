import { Component, OnInit, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { OrderDetail } from 'src/app/models/orderDetail.model';

@Component({
  selector: 'app-order-confirmation',
  templateUrl: './order-confirmation.page.html',
  styleUrls: ['./order-confirmation.page.scss'],
})
export class OrderConfirmationPage implements OnInit {

  @Input() orderDetail: OrderDetail;
  totalPrice = 0;

  constructor(
    private popoverController: PopoverController,
  ) { }

  ngOnInit() {
    console.log(this.orderDetail);
    this.orderDetail.items.forEach(item => {
      this.totalPrice += item.price * item.numberOfItem;
    });
  }

  closeModal() {
    this.popoverController.dismiss();
  }

  acceptOrder() {
    this.popoverController.dismiss({
      command: 'accept',
      orderDetail: this.orderDetail
    });
  }

  rejectOrder() {
    this.popoverController.dismiss({
      command: 'reject',
      orderDetail: this.orderDetail
    });
  }

  transformDateTime(dateTime: Date) {
    const date = dateTime.getDate();
    const month = dateTime.getMonth() + 1;
    const year = dateTime.getFullYear();
    const hour = dateTime.getHours().toString().padStart(2, '0');
    const minute = dateTime.getMinutes().toString().padStart(2, '0');
    return `${date}/${month}/${year} ${hour}:${minute}`;
  }

}
