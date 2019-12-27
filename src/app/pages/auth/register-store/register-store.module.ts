import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegisterStorePageRoutingModule } from './register-store-routing.module';

import { HttpClientModule } from '@angular/common/http';

import { RegisterStorePage } from './register-store.page';
import { Camera } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';

import { IonicStorageModule } from '@ionic/storage';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegisterStorePageRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    IonicStorageModule.forRoot()
  ],
  declarations: [RegisterStorePage],
  providers: [
    Camera,
    File,
    WebView,
    FilePath,
  ]
})
export class RegisterStorePageModule {}
