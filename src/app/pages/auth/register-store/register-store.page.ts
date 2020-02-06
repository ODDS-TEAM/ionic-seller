import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

import { Plugins, CameraResultType, FilesystemDirectory } from '@capacitor/core';
import { AuthService } from 'src/app/services/auth/auth.service';

const { CapCamera, Filesystem, Camera } = Plugins;
const STORAGE_KEY = 'my_images';

@Component({
  selector: 'app-register-store',
  templateUrl: './register-store.page.html',
  styleUrls: ['./register-store.page.scss'],
})
export class RegisterStorePage implements OnInit {

  images: any;

  imagePath = '../../assets/images/logo.png';

  email: string;
  username: string;
  password: string;
  storeName: string;
  ownerName: string;
  phoneNumber: string;
  describe: string;

  currentImage: string;

  storeForm: FormGroup;

  constructor(
    private router: Router,
    private authService: AuthService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private fromBuilder: FormBuilder,
    private alertController: AlertController,
    private loadingController: LoadingController,
  ) { }

  ngOnInit() {
    this.email = this.route.snapshot.queryParamMap.get('email') || 'Email error';
    this.username = this.route.snapshot.queryParamMap.get('username') || 'Username error';
    this.password = this.route.snapshot.queryParamMap.get('password') || 'Password error';

    this.storeForm = this.fromBuilder.group({
      storeName: ['', [Validators.required, Validators.minLength(1)]],
      ownerName: ['', [Validators.required, Validators.minLength(1)]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^0[0-9]{9}$')]],
      describe: ['', [Validators.required, Validators.minLength(1)]],
    });
  }

  async selectImage() {
    const image = await Camera.getPhoto({
      resultType: CameraResultType.DataUrl,
    });

    this.currentImage = image.dataUrl;
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

    return new Blob([ab], { type: mimeType});
  }

  buildInfo() {
    const formValue = this.storeForm.value;

    const credential = {
      email: this.email,
      password: this.password
    };

    const user = {
      email: this.email,
      restaurantName: formValue.storeName,
      ownerName: formValue.ownerName,
      phoneNumber: formValue.phoneNumber,
      description: formValue.describe,
    };

    return {user, credential};
  }

  async onClickConfirm() {
    try {
      const info = this.buildInfo();
      const user = await this.authService.signUp(info.user, info.credential);
      const imgBlob = this.base64toBlob(this.currentImage);
      await this.authService.uploadImage(user.uid, imgBlob);
    } catch (err) {
      if (err === 'dup') {
        this.presentAlert('มีผู้ใช้อื่นใช้ชื่อร้านนี้แล้ว');
      }
    }
  }

  async presentAlert(message) {
    const alert = await this.alertController.create({
      header: 'เกิดข้อผิดพลาด',
      message,
      buttons: ['OK']
    });

    await alert.present();
  }

  gotoTabs() {
    this.router.navigate(['/main/order'], { replaceUrl: true });
  }

}
