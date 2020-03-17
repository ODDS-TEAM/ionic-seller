import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MailCredential } from '../../models/mailCredentials.model';
import { User } from 'src/app/models/user.model';
import { StorageService } from '../storage/storage.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private AUTH_URL = `${environment.apiUrl}/auth/merchant`;
  private SIGN_UP_URL = `${this.AUTH_URL}/signup`;
  private LOGIN_URL = `${this.AUTH_URL}/login`;
  private UPLOAD_IMAGE_URL = `${environment.apiUrl}/upload/img/merchant/`;

  private authenticationState = new BehaviorSubject(false);

  constructor(
    private storage: StorageService,
    private http: HttpClient
  ) { }

  checkEmailExistant(email: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const http = this.http.request('GET', `${this.SIGN_UP_URL}/${email}`, {
        observe: 'response'
      }).subscribe(
        res => {
          resolve(true);
          http.unsubscribe();
        }, err => {
          if (err.status === 401) {
            resolve(false);
          }
          reject();
          http.unsubscribe();
        }
      );
    });
  }

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

  saveProfile(user: User | null, mailCredential: MailCredential) {
    this.storage.setUserInfo(user);
    this.storage.setMailCredential(mailCredential);
  }

  login(credential: MailCredential) {
    return new Promise((resolve, reject) => {
      const http = this.http.request<User>('POST', `${this.LOGIN_URL}`, {
        observe: 'response',
        body: credential
      }).subscribe(
        res => {
          resolve(true);
          this.saveProfile(res.body, credential);
          this.authenticationState.next(true);
          http.unsubscribe();
        }, err => {
          reject(err);
        }
      );
    });
  }

  signUp(user, credential: MailCredential): Promise<User> {
    return new Promise((resolve, reject) => {
      this.http.request<User>('POST', `${this.AUTH_URL}/signup`, {
        observe: 'response',
        body: {
          email: credential.email,
          password: credential.password,
          restaurantName: user.restaurantName,
          ownerName: user.ownerName,
          phoneNumber: user.phoneNumber,
          description: user.description,
        }
      }).subscribe(
        res => {
          resolve(res.body);
          this.saveProfile(null, credential);
        }, err => {
          if (err.status === 401) {
            reject('dup');
          }
          reject(err);
          console.log(err);
        }
      );
    });
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
    return new Promise((resolve, reject) => {
      this.storage.emptyMailCredential().then(() => {
        this.authenticationState.next(false);
        resolve();
      }).catch(err => reject(err));
    });
  }

  uploadImage(uid: string, imgBlob: Blob) {
    const formData = new FormData();
    formData.append('imgRaw', imgBlob);
    return new Promise((resolve, reject) => {
      const http = this.http.request('POST', `${this.UPLOAD_IMAGE_URL}/${uid}`, {
        observe: 'response',
        body: formData
      }).subscribe(
        res => {
          resolve(res);
          http.unsubscribe();
        }, err => {
          reject();
        }
      );
    });
  }
}
