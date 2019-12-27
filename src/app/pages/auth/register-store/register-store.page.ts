import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera/ngx';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActionSheetController, Platform, ToastController, LoadingController } from '@ionic/angular';
import { FilePath } from '@ionic-native/file-path/ngx';
import { File, FileEntry } from '@ionic-native/file/ngx';
import { Storage } from '@ionic/storage';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { HttpClient } from '@angular/common/http';

import { finalize } from 'rxjs/operators';

const STORAGE_KEY = 'my_images';

@Component({
  selector: 'app-register-store',
  templateUrl: './register-store.page.html',
  styleUrls: ['./register-store.page.scss'],
})
export class RegisterStorePage implements OnInit {

  images = [];

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
        describe: describe,
      }
    })
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
    var options: CameraOptions = {
      quality: 100,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true,
    };

    this.camera.getPicture(options).then(imagePath => {
      if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
        this.filePath.resolveNativePath(imagePath)
          .then(filePath => {
            let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
            let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
            this.copyFileToLocalDir(correctPath, currentName, this.createFileName())
          });
      } else {
        var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
      }
    })
  }

  createFileName() {
    var d = new Date(),
        n = d.getTime,
        newFileName = n + ".jpg";
    return newFileName;
  }

  copyFileToLocalDir(namePath, currentName, newFileName) {
    this.file.copyFile(namePath, currentName, this.file.dataDirectory, newFileName)
      .then(success => {
        this.updateStoredImages(newFileName);
      }, error => {
        this.presentToast('Error while storing file.');
      })
  }

  updateStoredImages(name) {
    this.storage.get(STORAGE_KEY).then(images => {
      let arr = JSON.parse(images);
      if (!arr) {
        let newImages = [name];
        this.storage.set(STORAGE_KEY, JSON.stringify(newImages));
      } else {
        arr.push(name);
        this.storage.set(STORAGE_KEY, JSON.stringify(arr));
      }

      let filePath = this.file.dataDirectory + name;
      let resPath = this.pathForImage(filePath);

      let newEntry = {
        name: name,
        path: resPath,
        filePath: filePath,
      };

      this.images = [newEntry];
      this.ref.detectChanges();
    })
  }

  pathForImage(img) {
    if (img == null) {
      return '';
    } else {
      let converted = this.webview.convertFileSrc(img);
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
    this.file.resolveLocalFilesystemUrl(imgEntry.filePath)
      .then(entry => { 
        ( < FileEntry> entry).file(file => this.readFile(file))
      })
      .catch(err => {
        this.presentToast('Error while reading file.');
      })
  }

  readFile(file: any) {
    const reader = new FileReader();
    reader.onload = () => {
      const formData = new FormData();
      const imgBlob = new Blob([reader.result], {
        type: file.type
      });
      formData.append('file', imgBlob, file.name);

      formData.append('username', this.username);
      formData.append('password', this.password);
      formData.append('email', this.email);
      formData.append('storeName', this.storeName);
      formData.append('ownerName', this.ownerName);
      formData.append('describe', this.describe);
      formData.append('phoneNumber', this.phoneNumber);

      this.uploadImageData(formData);
    };
    reader.readAsArrayBuffer(file);
  }

  async uploadImageData(formData: FormData) {
    const loading = await this.loadingController.create({
      message: 'Uploading image...',
    });
    await loading.present();

    this.http.post('http://http://8cc1029f.ngrok.io/upload', formData)
      .pipe(
        finalize(() => {
          loading.dismiss();
        })
      )
      .subscribe(res => {
        if (res['success']) {
          this.presentToast('File upload complete.');
        } else {
          this.presentToast('File upload failed.');
        }
      });
  }

  gotoTabs() {
    this.router.navigate(['tabs']);
  }

}
