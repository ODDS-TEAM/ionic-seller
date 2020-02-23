import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DeleteConfirmPage } from './delete-confirm.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  declarations: [DeleteConfirmPage],
  entryComponents: [DeleteConfirmPage]
})
export class DeleteConfirmPageModule {}
