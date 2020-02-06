import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { throwError } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  credentialsForm: FormGroup;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private alertController: AlertController,
    private auth: AuthService
  ) { }

  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'รูปแบบไม่ถูกต้อง',
      // subHeader: 'Subittle',
      message,
      buttons: ['ตกลง'],
    });

    await alert.present();
  }

  ngOnInit() {
    this.credentialsForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(1)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(1)]]
    });
  }

  async onClickNext() {
    const formValues = this.credentialsForm.value;
    const email = formValues.email;
    const password = formValues.password;
    const confirmPassword = formValues.confirmPassword;

    let alertMessage = '';
    let isValid = true;

    if (confirmPassword !== password) {
      alertMessage += 'กรอกรหัสผ่านไม่ตรงกัน ';
      isValid = false;
    }

    if (!await this.auth.checkEmailExistant(email)) {
      this.presentAlert('อีเมลล์นี้มีผู้ใช้งานอยู่แล้ว');
      return;
    }

    if (isValid) {
      this.router.navigate(['register-store'], {
        replaceUrl: true,
        queryParams: {
          email,
          password,
        }
      });
    } else {
      this.presentAlert(alertMessage);
      return;
    }
  }

}
