import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
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
        path: 'table',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../pages/table/table.module').then(m => m.TablePageModule)
          }
        ]
      },
      {
        path: 'addList',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../pages/add-list/add-list.module').then(m => m.AddListPageModule)
          }
        ]
      },
      {
        path: 'history',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../pages/history/history.module').then(m => m.HistoryPageModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: '/tabs/order',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/order',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
