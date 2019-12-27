import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { throwError } from 'rxjs';

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
  ) { }

  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'รูปแบบไม่ถูกต้อง',
      // subHeader: 'Subittle',
      message: message,
      buttons: ['ตกลง'],
    });

    await alert.present();
  }

  ngOnInit() {
    this.credentialsForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.minLength(1)]],
      password: ['', [Validators.required, Validators.minLength(1)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(1)]]
    });

    this.credentialsForm.setValue({
      email: 'tm@odds.team',
      username: 'teema',
      password: '123',
      confirmPassword: '123',
    })
  }

  onClickNext() {
    console.log('click next');
    const formValues = this.credentialsForm.value;
    const email = formValues.email;
    const username = formValues.username;
    const password = formValues.password;
    const confirmPassword = formValues.confirmPassword;

    let alertMessage = "";
    let isValid = true;

    if (confirmPassword != password) {
      alertMessage += "กรอกรหัสผ่านไม่ตรงกัน ";
      isValid = false;
    }

    if (isValid)
      this.router.navigate(['register-store'], {
        replaceUrl: true,
        queryParams: {
          email: email,
          username: username,
          password: password,
        }
      });
    else
      this.presentAlert(alertMessage);
  }

}
