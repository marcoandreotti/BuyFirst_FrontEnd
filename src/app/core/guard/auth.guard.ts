import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '@app/service/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    public auth: AuthService,
    public router: Router
  ) { }

  canActivate(): boolean {
    let token = this.auth.getState().jwToken;
    return token != null;
  }
}
