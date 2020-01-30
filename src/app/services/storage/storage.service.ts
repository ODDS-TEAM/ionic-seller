import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  USER_KEY = 'user';

  constructor(private storage: Storage) { }

  getUid() {
    // TODO: If no uid found, show the error and get back to login
    return new Promise<string>((resolve, reject) => {
      this.storage.set(this.USER_KEY, JSON.stringify({ uid: '5e2a8800ecd19a20cc1290f5'}))
        .then(res => {
          const user: User = JSON.parse(res);
          resolve(user.uid);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  setUid(uid: string) {

  }
}
