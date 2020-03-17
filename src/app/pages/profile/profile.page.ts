import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ProfileService } from 'src/app/services/api-caller/profile/profile.service';
import { User } from 'src/app/models/user.model';
import { LoadingController, ToastController } from '@ionic/angular';

import { Plugins, CameraResultType, FilesystemDirectory } from '@capacitor/core';

const { CapCamera, Filesystem, Camera } = Plugins;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  editMode = false;

  selectImageUrl: string;

  profileFormGroup: FormGroup;

  currentUserInfo: User;

  changeImage = false;

  constructor(
    private auth: AuthService,
    private profile: ProfileService,
    private router: Router,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) { }

  async ngOnInit() {
    this.initialFormGroup();
    const loading = await this.presentLoading();
    await this.setUserProfile();
    loading.dismiss();
  }

  initialFormGroup() {
    this.profileFormGroup = new FormGroup({
      restaurantName: new FormControl('', [Validators.required]),
      ownerName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      description: new FormControl('', [Validators.required])
    });
  }

  async setUserProfile() {
    const userInfo = await this.profile.getProfile();
    this.currentUserInfo = userInfo;
    this.profileFormGroup.setValue({
      restaurantName: userInfo.restaurantName,
      ownerName: userInfo.ownerName,
      email: userInfo.email,
      description: userInfo.description
    });
    this.changeImage = false;
  }

  async onPressProfilePicture() {
    const complete = await this.selectImage();
    if (complete) {
      this.changeImage = true;
    }
  }

  async onPressEditProfile() {
    this.toggleEditMode();
  }

  async onPressUpdateProfile() {
    const loading = await this.presentLoading();
    try {
      await this.profile.updateProfile(this.profileFormGroup.value);
      if (this.changeImage) {
        const imgBlob = this.base64toBlob(this.selectImageUrl);
        await this.profile.uploadProfilePicture(imgBlob);
      }
    } catch (err) {
      this.presentToast(err);
    } finally {
      await this.setUserProfile();
      loading.dismiss();
      this.toggleEditMode();
    }
  }

  async onPressCancel() {
    this.toggleEditMode();
    this.profileFormGroup.setValue({
      restaurantName: this.currentUserInfo.restaurantName,
      ownerName: this.currentUserInfo.ownerName,
      email: this.currentUserInfo.email,
      description: this.currentUserInfo.description
    });
  }

  async onPressSignOut() {
    await this.signOut();
  }

  async selectImage() {
    try {
      const image = await Camera.getPhoto({
        resultType: CameraResultType.DataUrl,
      });
      this.selectImageUrl = image.dataUrl;
      return true;
    } catch (err) {
      console.log('catch on selectImage()');
    }
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
  }

  signOut() {
    this.auth.signOut().then(() => {
      this.router.navigate(['/login']);
    }).catch(err => console.error(err));
  }

  base64toBlob(base64Url: string): Blob {
    const mimeType = base64Url.split(',')[0].split(';')[0].split(':')[1];
    const data = base64Url.split(',')[1];

    const byte = atob(data);
    const ab = new ArrayBuffer(byte.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byte.length; i++) {
      ia[i] = byte.charCodeAt(i);
    }

    return new Blob([ab], { type: mimeType });
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      spinner: 'bubbles',
      backdropDismiss: false
    });
    await loading.present();
    return loading;
  }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message,
      duration: 2000
    });
    toast.present();
  }

}
