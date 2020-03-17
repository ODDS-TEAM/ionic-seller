import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ToastController } from '@ionic/angular';
import { StorageService } from 'src/app/services/storage/storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  credentialsForm: FormGroup;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private toastController: ToastController,
    private storage: StorageService
  ) { }

  ngOnInit() {
    this.credentialsForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.minLength(1)]],
      password: ['', [Validators.required, Validators.minLength(1)]]
    });
    this.reLogin();
  }

  async reLogin() {
    this.authService.relogin()
      .then((res: boolean) => {
        if (res) {
          this.router.navigate(['/main/order']);
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  onClickLogin() {
    this.authService.login({
      email: this.credentialsForm.value.email,
      password: this.credentialsForm.value.password
    }).then(res => this.router.navigate(['/main/order']))
      .catch(err => {
        console.log(err);
        this.presentToast('Email and password doesn\'t match or exist.');
      });
  }

  onClickRegister() {
    this.router.navigate(['/register']);
  }

  goToTab() {
    this.storage.setFakeUserInfo();
    this.router.navigate(['/main/order']);
  }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message,
      duration: 2000
    });
    toast.present();
  }
}
