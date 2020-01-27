import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { OrderConfirmationPage } from './order-confirmation/order-confirmation.page';

@Component({
  selector: 'app-order',
  templateUrl: './order.page.html',
  styleUrls: ['./order.page.scss'],
})
export class OrderPage implements OnInit {

  constructor(private modalController: ModalController) { }

  ngOnInit() {
    this.openConfirmationModal(1, true);
  }

  async openConfirmationModal(index, isToday) {
    const modal = await this.modalController.create({
      component: OrderConfirmationPage,
      componentProps: {}
    });

    await modal.present();

    modal.onDidDismiss().then().catch();
  }

}
