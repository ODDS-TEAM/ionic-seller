import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-delete-confirm',
  templateUrl: './delete-confirm.page.html',
  styleUrls: ['./delete-confirm.page.scss'],
})
export class DeleteConfirmPage implements OnInit {

  constructor(
    private popoverController: PopoverController
  ) { }

  ngOnInit() {
  }

  cancel() {
    this.popoverController.dismiss(null, 'cancel');
  }

  delete() {
    this.popoverController.dismiss(null, 'delete');
  }

}
