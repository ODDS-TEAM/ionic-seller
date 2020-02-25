import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { User } from '../../models/user.model';
import { MailCredential } from 'src/app/models/mailCredentials.model';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  USER_KEY = 'user';
  CREDENTIAL_KEY = 'mail_credential';

  constructor(private storage: Storage) { }

  setFakeUserInfo() {
    return this.setUserInfo({
      uid: '5e2a8800ecd19a20cc1290f5',
      email: 'a@gmail.com',
      restaurantName: 'ลุงธี',
      ownerName: 'Teema Luksameset',
      phoneNumber: '0876543210',
      description: 'เนื้องัว ร้านอยู่หน้าซอย',
      imageUrl: 'url'
    });
  }

  setUserInfo(user: User) {
    return new Promise((resolve, reject) => {
      this.storage.set(this.USER_KEY, JSON.stringify(user))
        .then(res => {
          resolve(res);
        }).catch(err => {
          reject(err);
        });
    });
  }

  getUserInfo() {
    return new Promise<User>((resolve, reject) => {
      this.storage.get(this.USER_KEY)
        .then(res => {
          const user: User = JSON.parse(res);
          resolve(user);
        }).catch(err => {
          reject(err);
        });
    });
  }

  setMailCredential(credential: MailCredential) {
    return new Promise((resolve, reject) => {
      this.storage.set(this.CREDENTIAL_KEY, JSON.stringify(credential))
        .then(res => {
          resolve(res);
        }).catch(err => {
          reject(err);
        });
    });
  }

  emptyMailCredential() {
    return new Promise((resolve, reject) => {
     this.storage.remove(this.CREDENTIAL_KEY)
        .then(res => {
          resolve(res);
        }).catch(err => {
          reject(err);
        });
    });
  }

  getMailCredential() {
    // return new Promise<MailCredential>((resolve) => {
    //   resolve({ email: 'a@gmail.com', password: '5555' });
    // });
    return new Promise<MailCredential>((resolve, reject) => {
      this.storage.get(this.CREDENTIAL_KEY)
        .then(res => {
          const cred: MailCredential = JSON.parse(res);
          console.log(cred);
          resolve(cred);
        }).catch(err => {
          reject(err);
        });
    });
  }
}
