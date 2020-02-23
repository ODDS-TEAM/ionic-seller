import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';

import { Plugins, CameraResultType } from '@capacitor/core';
import { HttpClient } from '@angular/common/http';
import { NavController, LoadingController, ModalController } from '@ionic/angular';

import { FoodMenuDetail } from '../../models/menuDetail.model';
import { MenuService } from 'src/app/services/api-caller/menu/menu.service';

const { Camera } = Plugins;

@Component({
  selector: 'app-create-menu',
  templateUrl: './create-menu.page.html',
  styleUrls: ['./create-menu.page.scss'],
})
export class CreateMenuPage implements OnInit {

  formGroup: FormGroup;
  currentImageUrl: string;

  constructor(
    private formBuilder: FormBuilder,
    private menuService: MenuService,
    private loadingController: LoadingController,
    private modalController: ModalController
  ) { }

  ngOnInit() {

    // tslint:disable-next-line: max-line-length
    this.currentImageUrl = 'data:image/jpeg;base64,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';

    this.formGroup = this.formBuilder.group({
      foodName: [''],
      price: ['', Validators.min(1)],
      description: [''],
      options: this.formBuilder.array([
        this.formBuilder.group({
          titleOption: [''],
          singleChoice: [''],
          choices: this.formBuilder.array([
            this.formBuilder.group({
              titleChoice: [''],
              priceChoice: ['', Validators.min(0)]
            })
          ])
        })
      ])
    });

    this.getChoices(0).at(0).get('priceChoice').setValue('0');
  }

  get options() {
    return this.formGroup.get('options') as FormArray;
  }

  getChoices(index: number) {
    return ((this.formGroup.get('options') as FormArray).at(index) as FormGroup).get('choices') as FormArray;
  }

  addOption() {
    const group = this.formBuilder.group({
      titleChoice: [''],
      priceChoice: ['', Validators.min(0)]
    });
    group.controls.priceChoice.setValue('0');
    this.options.push(this.formBuilder.group({
      titleOption: [''],
      singleChoice: [''],
      choices: this.formBuilder.array([
        group
      ])
    }));
  }

  addChoice(optionIndex: number) {
    const group = this.formBuilder.group({
      titleChoice: [''],
      priceChoice: ['', Validators.min(0)]
    });
    group.controls.priceChoice.setValue('0');
    this.getChoices(optionIndex).push(group);
  }

  async selectImage() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.DataUrl
    });

    this.currentImageUrl = image.dataUrl;
  }

  async createMenu() {
    const value: FoodMenuDetail = this.formGroup.value;
    for (const option of value.options) {
      option.singleChoice = option.singleChoice === 'true';
    }

    const loading = await this.presentLoading();
    try {
      const food = await this.menuService.createMenu(value);
      console.log(food);
      const mimeType = this.currentImageUrl.split(',')[0].split(';')[0].split(':')[1];
      const data = this.currentImageUrl.split(',')[1];

      const byte = atob(data);
      const ab = new ArrayBuffer(byte.length);
      const ia = new Uint8Array(ab);

      for (let i = 0; i < byte.length; i++) {
        ia[i] = byte.charCodeAt(i);
      }

      const imgBlob = new Blob([ab], { type: mimeType });

      await this.menuService.uploadMenuImage(food._id, imgBlob);
      this.modalController.dismiss();
    } catch (err) {
      console.log(err);
    } finally {
      loading.dismiss();
    }
  }

  logForm() {
    console.log(this.formGroup.value);
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      spinner: 'bubbles'
    });
    await loading.present();
    return loading;
  }
}
