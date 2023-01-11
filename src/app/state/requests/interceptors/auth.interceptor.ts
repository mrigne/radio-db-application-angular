import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AUTH_LOCAL_STORAGE_NAME } from '../../auth/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        const token = localStorage.getItem(AUTH_LOCAL_STORAGE_NAME);
        return next.handle(token ? request.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        }) : request);
    }
}
