import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { JwtHelper } from '../../helpers/jwt.helper';
import { AUTH_LOCAL_STORAGE_NAME } from '../state/auth/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthorizedGuard implements CanActivateChild {
    constructor(private router: Router, private cookieService: CookieService) {
    }

    public canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        const expiryDate = JwtHelper.getExpiryDate(localStorage.getItem(AUTH_LOCAL_STORAGE_NAME));
        if (expiryDate > new Date()) {
            return true;
        }
        return this.router.createUrlTree(['login']);
    }
}
