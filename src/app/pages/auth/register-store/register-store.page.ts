import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera/ngx';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActionSheetController, Platform, ToastController, LoadingController } from '@ionic/angular';
import { FilePath } from '@ionic-native/file-path/ngx';
import { File, FileEntry, IFile } from '@ionic-native/file/ngx';
import { Storage } from '@ionic/storage';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { HttpClient } from '@angular/common/http';

import { finalize } from 'rxjs/operators';

import { Capacitor, Plugins, CameraResultType, FilesystemDirectory } from '@capacitor/core';
import { present } from '@ionic/core/dist/types/utils/overlays';

const { CapCamera, Filesystem } = Plugins;
const STORAGE_KEY = 'my_images';

@Component({
  selector: 'app-register-store',
  templateUrl: './register-store.page.html',
  styleUrls: ['./register-store.page.scss'],
})
export class RegisterStorePage implements OnInit {

  /*
   * Call selectImage() by press image >> call takePicture() > copyFileToLocalDir()
   * > updateStoredImages() > " GOT IMAGE!! "
   *
   * Press upload > startUpload() > readFile() > uploadImageData()
   *
   * TODO:
   *  - After loading controller dismiss navigating to order
   *  - Edit UI to match pre-design
   */

  images: any;

  imagePath = '../../assets/images/logo.png';

  email: string;
  username: string;
  password: string;
  storeName: string;
  ownerName: string;
  phoneNumber: string;
  describe: string;

  storeForm: FormGroup;

  constructor(
    private router: Router,
    private http: HttpClient,
    private storage: Storage,
    private file: File,
    private filePath: FilePath,
    private platform: Platform,
    private camera: Camera,
    private route: ActivatedRoute,
    private fromBuilder: FormBuilder,
    private actionSheetController: ActionSheetController,
    private ref: ChangeDetectorRef,
    private toastController: ToastController,
    private webview: WebView,
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

  onClickConfirm() {
    const formValues = this.storeForm.value;
    this.storeName = formValues.storeName;
    this.ownerName = formValues.storeName;
    this.phoneNumber = formValues.phoneNumber;
    this.describe = formValues.describe;

    console.log({
      username: this.username,
      password: this.password,
      email: this.email,
      storeInfo: {
        name: this.storeName,
        owner: this.ownerName,
        phoneNumber: this.phoneNumber,
        describe: this.describe,
      }
    });

    this.gotoTabs();
  }

  async selectImage() {
    const actionSheet = await this.actionSheetController.create({
      header: 'เลือกแหล่งภาพ',
      buttons: [{
        text: 'ภาพจากอัลบั้ม',
        handler: () => {
          this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
        }
      },
      {
        text: 'ถ่ายภาพ',
        handler: () => {
          this.takePicture(this.camera.PictureSourceType.CAMERA);
        }
      }]
    });
    await actionSheet.present();
  }

  takePicture(sourceType: PictureSourceType) {
    const options: CameraOptions = {
      quality: 100,
      sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true,
    };

    this.camera.getPicture(options).then(imagePath => {
      if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
        this.filePath.resolveNativePath(imagePath)
          .then(filePath => {
            this.imagePath = filePath;
            const correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
            const currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
            this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
          });
      } else {
        this.imagePath = imagePath;
        const currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        const correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
      }
    });
  }

  createFileName() {
    const d = new Date(),
      n = d.getTime(),
      newFileName = '' + n + '.jpg';
    return newFileName;
  }

  copyFileToLocalDir(namePath, currentName, newFileName: string) {
    const oldPath = namePath + currentName;
    const newPath = this.file.dataDirectory + newFileName;
    Filesystem.copy({
      from: oldPath,
      to: newPath
    }).then(result => {
      this.updateStoredImages(newPath);
    }).catch(err => {
      this.presentToast('Error while copy file to local directory');
    });
  }

  updateStoredImages(name) {
    this.storage.get(STORAGE_KEY).then(images => {
      const arr = JSON.parse(images);
      if (!arr) {
        const newImages = [name];
        this.storage.set(STORAGE_KEY, JSON.stringify(newImages));
      } else {
        arr.push(name);
        this.storage.set(STORAGE_KEY, JSON.stringify(arr));
      }

      const filePath = this.file.dataDirectory + name.substr(name.lastIndexOf('/') + 1);
      const resPath = this.pathForImage(filePath);

      const newEntry = {
        name,
        path: resPath,
        filePath,
      };

      console.log(resPath);

      this.images = newEntry;
      this.imagePath = resPath;
      this.ref.detectChanges();
    })
      .catch(err => console.log(err));
  }

  pathForImage(img) {
    if (img == null) {
      return '';
    } else {
      const converted = this.webview.convertFileSrc(img);
      return converted;
    }
  }

  async presentToast(text) {
    const toast = await this.toastController.create({
      message: text,
      position: 'bottom',
      duration: 3000
    });
    toast.present();
  }

  startUpload(imgEntry) {
    this.readFile(this.images.name);
  }

  readFile(filePath) {
    console.log('======================READINGFILE!!!!');
    Filesystem.readFile({
      path: filePath,
    })
      .then(result => {

        const formData = new FormData();
        const fileName = filePath.substring(filePath.lastIndexOf('/') + 1, filePath.lastIndexOf('?'));

        const byte = atob(result.data);
        const ab = new ArrayBuffer(byte.length);
        const ia = new Uint8Array(ab);

        for (let i = 0; i < byte.length; i++) {
          ia[i] = byte.charCodeAt(i);
        }

        const imgBlob = new Blob([ab], { type: 'image/jpeg' });
        formData.append('file', imgBlob, fileName);

        formData.append('username', this.username);
        formData.append('password', this.password);
        formData.append('email', this.email);
        formData.append('storeName', this.storeName);
        formData.append('ownerName', this.ownerName);
        formData.append('describe', this.describe);
        formData.append('phoneNumber', this.phoneNumber);

        console.log('BEFORE CALL UPLOADIMAGEDATA*********************************************')

        this.uploadImageData(formData);
      })
      .catch(err => {
        console.log(err);
        this.presentToast('Error while reading file');
      });
  }

  async uploadImageData(formData: any) {
    const loading = await this.loadingController.create({
      message: 'Uploading image...',
    });
    await loading.present();

    fetch('http://6869c035.ngrok.io/uploadStore', {
      method: 'POST',
      body: formData,
    }).then(response => {
        this.presentToast('File upload complete.');
        loading.dismiss();
    }).catch(err => {
      this.presentToast('File upload fail on http');
      console.log(err);
      loading.dismiss();
    });

    // this.http.post(
    //   'http://6869c035.ngrok.io/uploadStore',
    //   formData)
    //   // .pipe(
    //   //   finalize(() => {
    //   //     loading.dismiss();
    //   //   })
    //   // )
    //   .subscribe(res => {
    //     const SUCCESS = 'success';
    //     console.log(res);
    //     if (res[SUCCESS]) {
    //       this.presentToast('File upload complete.');
    //     } else {
    //       this.presentToast('File upload failed.');
    //     }
    //     loading.dismiss();
    //   }, err => {
    //     console.log(err);
    //     this.presentToast('File upload failed on http.');
    //     loading.dismiss();
    //   });
  }

  gotoTabs() {
    this.router.navigate(['/tabs/order'], { replaceUrl: true });
  }

}
