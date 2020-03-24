import { Injectable } from '@angular/core';
import { StorageService } from '../../storage/storage.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { History, HistoryDetail } from 'src/app/models/history.model';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  constructor(
    private storage: StorageService,
    private http: HttpClient
  ) { }

  getHistoryList(): Promise<History[]> {
    return new Promise<History[]>((resolve, reject) => {
      this.storage.getUserInfo().then(cacheUser => {
        this.http.get<History[]>(`${environment.apiUrl}/merchant/history/${cacheUser.uid}`, { observe: 'response' })
          .subscribe(
            res => {
              const body = res.body.map(ele => {
                ele.dateTime = new Date(ele.dateTime);
                return ele;
              });
              resolve(body);
            }, err => console.error(err)
          );
      });
    });
  }

  getHistoryDetail(hid: string) {
    return new Promise<HistoryDetail>((resolve, reject) => {
      this.http.get<HistoryDetail>(`${environment.apiUrl}/merchant/history/detail/${hid}`, { observe: 'response' })
        .subscribe(
          res => {
            res.body.dateTime = new Date(res.body.dateTime);
            resolve(res.body);
          }, err => console.error(err)
        );
    });
  }
}
