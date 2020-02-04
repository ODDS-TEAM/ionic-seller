import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateMenuPage } from './create-menu.page';

const routes: Routes = [
  {
    path: '',
    component: CreateMenuPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateMenuPageRoutingModule {}
