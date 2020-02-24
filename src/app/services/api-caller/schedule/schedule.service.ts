import { Injectable } from '@angular/core';
import { StorageService } from '../../storage/storage.service';
import { HttpClient } from '@angular/common/http';
import { WEB_SERVICE_URL } from '../../webServiceVariable';
import { Menu } from 'src/app/models/schedule.model';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  private SCHEDULE_URL = `${WEB_SERVICE_URL}/merchant/schedule`;

  constructor(
    private storage: StorageService,
    private http: HttpClient
  ) { }

  getSchedule() {
    return new Promise<{ mon: Menu[], tue: Menu[], wed: Menu[], thu: Menu[], fri: Menu[] }>((resolve, reject) => {
      const menus = {
        mon: [],
        tue: [],
        wed: [],
        thu: [],
        fri: [],
      };
      this.storage.getUserInfo().then(user => {
        const http = this.http.request<Menu[]>('GET', `${this.SCHEDULE_URL}/${user.uid}`, {
          observe: 'response'
        }).subscribe(
          res => {
            for (const menu of res.body) {
              if (menu.day === 'mon') {
                menus.mon.push(menu);
              } else if (menu.day === 'tue') {
                menus.tue.push(menu);
              } else if (menu.day === 'wed') {
                menus.wed.push(menu);
              } else if (menu.day === 'thu') {
                menus.thu.push(menu);
              } else if (menu.day === 'fri') {
                menus.fri.push(menu);
              }
            }
            console.log(menus);
            resolve(menus);
            http.unsubscribe();
          }, err => {
            if (err.status === 401) {
              resolve(menus);
              return;
            }
            console.log(err);
            reject(menus);
            http.unsubscribe();
          }
        );
      }).catch(err => { console.log(err); resolve(menus); });
    });
  }

  editSchedule(day: string, dayMenuId: string, foodMenuId: string, menuName: string, foodLeft: number, imageUrl: string, price: number) {
    return new Promise((resolve, reject) => {
      this.storage.getUserInfo().then(user => {
        const date = this.getDateFormDay(this.getThisMonday(), day);
        const http = this.http.request('PUT', `${this.SCHEDULE_URL}/edit/${dayMenuId}`, {
          observe: 'response',
          body: {
            dayMenuId,
            day,
            week: this.getWeekNumber(date),
            year: date.getFullYear(),
            date: `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`,
            dateTime: date,
            foodMenuId,
            merchantId: user.uid,
            menuName,
            price,
            foodLeft,
            imageUrl,
          }
        }).subscribe(
          res => {
            resolve();
            http.unsubscribe();
          }, err => {
            reject(err);
            http.unsubscribe();
          }
        );
      }).catch(err => resolve(err));
    });
  }

  addSchedule(day: string, foodMenuId: string, menuName: string, foodLeft: number, imageUrl: string, price: number) {
    return new Promise((resolve, reject) => {
      this.storage.getUserInfo().then(user => {
        const date = this.getDateFormDay(this.getThisMonday(), day);
        const http = this.http.request('POST', `${this.SCHEDULE_URL}`, {
          observe: 'response',
          body: {
            day,
            week: this.getWeekNumber(date),
            year: date.getFullYear(),
            date: `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`,
            dateTime: date,
            foodMenuId,
            merchantId: user.uid,
            menuName,
            price,
            foodLeft,
            imageUrl,
          }
        }).subscribe(
          res => {
            resolve();
            http.unsubscribe();
          }, err => {
            reject(err);
            http.unsubscribe();
          }
        );
      }).catch(err => resolve(err));
    });
  }

  deleteSchedule(dayMenuId: string) {
    return new Promise((resolve, reject) => {
      this.storage.getUserInfo().then(user => {
        const http = this.http.request('DELETE', `${this.SCHEDULE_URL}/${dayMenuId}`, {
          observe: 'response'
        }).subscribe(
          res => {
            resolve(true);
            http.unsubscribe();
          }, err => {
            resolve(false);
            http.unsubscribe();
          }
        );
      });
    });
  }

  getThisMonday() {
    const date = new Date();
    if (date.getDay() === 1) {
      return date;
    }
    date.setDate(date.getDate() - date.getDay() + 1);
    return date;
  }

  getDateFormDay(thisMonday: Date, day: string) {
    let addDate;
    if (day === 'mon') {
      addDate = 0;
    } else if (day === 'tue') {
      addDate = 1;
    } else if (day === 'wed') {
      addDate = 2;
    } else if (day === 'thu') {
      addDate = 3;
    } else if (day === 'fri') {
      addDate = 4;
    }
    const date = new Date(thisMonday.getTime());
    date.setDate(date.getDate() + addDate);
    return date;
  }

  getWeekNumber(d: Date) {
    // Copy date so don't modify original
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    // Get first day of year
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    // Calculate full weeks to nearest Thursday
    const weekNo = Math.ceil(( ( (d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
    // Return array of year and week number
    return weekNo;
  }

  // `${date.getFullYear()}/${date.getMonth()}/${date.getDate()}`;
}
