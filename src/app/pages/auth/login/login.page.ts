import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  credentialsForm: FormGroup;

  constructor(private router: Router, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.credentialsForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(1)]],
      password: ['', [Validators.required, Validators.minLength(1)]]
    });
  }

  onClickLogin() {
    console.log('login clicked');
    console.log(`username: ${this.credentialsForm.value.username}`);
    console.log(`password: ${this.credentialsForm.value.password}`);
    console.log(this.credentialsForm.value);
  }
  
  onClickRegister() {
    console.log('register clicked');
    this.router.navigate(['register']);
  }
}
