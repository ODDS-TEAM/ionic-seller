import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MailCredential } from '../../models/mailCredentials.model';
import { User } from 'src/app/models/user.model';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private URL = 'http://103.74.254.74:3000';

  private authenticationState = new BehaviorSubject(false);

  constructor(
    private storage: StorageService
  ) { }

  isLogin() {
    return this.authenticationState.value;
  }

  relogin() {
    return new Promise<boolean>((resolve, reject) => {
      this.storage.getMailCredential().then((cred: MailCredential) => {
        this.login(cred)
          .then(() => resolve(true))
          .catch(() => resolve(false));
      });
    });
  }

  saveProfile(user: User, mailCredential: MailCredential) {
    this.storage.setUserInfo(user);
    this.storage.setMailCredential(mailCredential);
  }

  login(credential: MailCredential) {
    return new Promise((resolve, reject) => {
      /**
       * TODO:
       * post to merchant login
       * res
       * resolve res
       * saveProfile
       * err
       * reject err
       */
      reject();
    });
  }

  signUp() {
    /**
     * TODO:
     * post to merchant register
     * res
     * resolve res
     * saveProfile
     * err
     * reject err
     */
  }

  signOut() {
    this.storage.emptyMailCredential().then(() => {
      this.authenticationState.next(false);
    }).catch(err => console.log(err));
  }
}
