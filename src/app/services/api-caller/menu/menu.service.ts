import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StorageService } from '../../storage/storage.service';
import { WEB_SERVICE_URL } from '../../webServiceVariable';
import { FoodMenu } from 'src/app/models/menu.model';
import { FoodMenuDetail } from 'src/app/models/menuDetail.model';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private MENU_URL = `${WEB_SERVICE_URL}/merchant/menu`;

  constructor(
    private http: HttpClient,
    private storage: StorageService
  ) { }

  getMenuList() {
    return new Promise<FoodMenu[]>((resolve, reject) => {
      this.storage.getUserInfo().then(user => {
        const http = this.http.request<FoodMenu[]>('GET', `${this.MENU_URL}/${user.uid}`, {
          observe: 'response'
        }).subscribe(
          res => {
            resolve(res.body);
            http.unsubscribe();
          }, err => {
            if (err.status === 401) {
              resolve([]);
            }
            reject(err);
            http.unsubscribe();
          }
        );
      });
    });
  }

  createMenu(food: FoodMenuDetail) {
    return new Promise<FoodMenuDetail>((resolve, reject) => {
      this.storage.getUserInfo().then(user => {
        food.merchantId = user.uid;
        food.imageUrl = 'foodUrl';
        const http = this.http.request<FoodMenuDetail>('POST', this.MENU_URL, {
          observe: 'response',
          body: food
        }).subscribe(
          res => {
            resolve(res.body);
            http.unsubscribe();
          }, err => {
            reject(err);
            http.unsubscribe();
          }
        );
      });
    });
  }

  uploadMenuImage(foodId: string, imgBlob: Blob) {
    const formData = new FormData();
    formData.append('imgRaw', imgBlob, 'a.png');
    return new Promise((resolve, reject) => {
      const http = this.http.request('POST', `${WEB_SERVICE_URL}/upload/img/food/${foodId}`, {
        observe: 'response',
        body: formData
      }).subscribe(
        res => {
          resolve(res.body);
          http.unsubscribe();
        }, err => {
          reject(err);
          http.unsubscribe();
        }
      );
    });
  }
}
