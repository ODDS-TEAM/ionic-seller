import { Injectable } from '@angular/core';
import { WeekMenus } from 'src/app/models/week-menus.model';

@Injectable({
  providedIn: 'root'
})
export class WeekMenusService {

  constructor() { }

  getListWeek(): WeekMenus {
    const listWeekMenus: WeekMenus = {
      week: 2,
      days: [
        {
          day: 'mon',
          date: new Date(),
          stores: [
            {
              sellerID: '118899',
              name: 'ตามสั่ง',
              menus: [
                {
                  menuID: '11001',
                  name: 'ข้าวกะเพรา',
                  imgUrl: 'assets/images/ka-praw.jpg',
                  limit: 250
                }
              ]
            }
          ]
        },
        {
          day: 'tue',
          date: new Date(),
          stores: [
            {
              sellerID: '118899',
              name: 'ตามสั่ง',
              menus: []
            }
          ]
        },
        {
          day: 'thu',
          date: new Date(),
          stores: [
            {
              sellerID: '118899',
              name: 'ตามสั่ง',
              menus: [
                {
                  menuID: '11002',
                  name: 'ผัดซีอิ๊ว',
                  imgUrl: 'assets/images/pad-see-ew.png',
                  limit: 100
                },
                {
                  menuID: '11003',
                  name: 'ข้าวผัด',
                  imgUrl: 'assets/images/kao-pad.png',
                  limit: 150
                }
              ]
            }
          ]
        },
        {
          day: 'fri',
          date: new Date(),
          stores: [
            {
              sellerID: '118899',
              name: 'ตามสั่ง',
              menus: [
                {
                  menuID: '11001',
                  name: 'ข้าวกะเพรา',
                  imgUrl: 'assets/images/ka-praw.jpg',
                  limit: 200
                }
              ]
            }
          ]
        }
      ]
    };
    return listWeekMenus;
  }
}
