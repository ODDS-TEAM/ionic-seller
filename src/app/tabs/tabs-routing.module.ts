import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'order',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../pages/order/order.module').then(m => m.OrderPageModule)
          }
        ]
      },
      {
        path: 'schedule',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../pages/schedule/schedule.module').then(m => m.SchedulePageModule)
          }
        ]
      },
      {
        path: 'menu',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../pages/menu/menu.module').then(m => m.MenuPageModule)
          }
        ]
      },
      {
        path: 'activity',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../pages/activity/activity.module').then(m => m.ActivityPageModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: '/main/order',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/main/order',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
