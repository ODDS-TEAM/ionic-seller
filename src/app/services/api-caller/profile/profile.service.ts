import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StorageService } from '../../storage/storage.service';
import { environment } from 'src/environments/environment';
import { User } from 'src/app/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(
    private http: HttpClient,
    private storage: StorageService
  ) { }

  getProfile() {
    return new Promise<User>((resolve, reject) => {
      this.storage.getUserInfo().then(storageUser => {
        this.http.get<User>(`${environment.apiUrl}/merchant/profile/${storageUser.uid}`, { observe: 'response' })
          .subscribe( userInfo => {
            resolve(userInfo.body);
          }, err => {
            reject(err);
          });
      });
    });
  }

  updateProfile(body: { restaurantName: string, ownerName: string, email: string, description: string }) {
    return new Promise((resolve, reject) => {
      this.storage.getUserInfo().then(storageUser => {
        this.http.post(`${environment.apiUrl}/merchant/profile/edit/${storageUser.uid}`, body, { observe: 'response' })
          .subscribe( response => {
            resolve(response);
          }, err => {
            console.error(err);
            reject('Got error while changing profile info');
          });
      });
    });
  }

  uploadProfilePicture(imgBlob: Blob) {
    const form = new FormData();
    form.append('imgRaw', imgBlob);
    return new Promise((resolve, reject) => {
      this.storage.getUserInfo().then(storageUser => {
        this.http.post(`${environment.apiUrl}/upload/img/merchant/${storageUser.uid}`, form, { observe: 'response' })
          .subscribe( response => {
            resolve(response);
          }, err => {
            console.error(err);
            reject('Got error while uploading profile picture');
          });
      });
    });
  }
}
