import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private auth: AuthService
  ) { }

  canActivate(): Promise<boolean> {
    return new Promise((resolve) => resolve(true));
    return new Promise<boolean>((resolve, reject) => {
      if (this.auth.isLogin()) {
        resolve(true);
      } else {
        this.router.navigate(['/login']);
        reject(false);
      }
    });
  }
}
