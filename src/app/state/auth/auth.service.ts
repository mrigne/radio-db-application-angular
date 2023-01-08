import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable, tap } from 'rxjs';
import { Config } from '../../config/config';
import { HttpMethod } from '../requests/requester';
import { RequesterFactory } from '../requests/requester-factory';

export const AUTH_LOCAL_STORAGE_NAME = 'rdb-access-token';

export interface ISignInRequest {
    userName: string;
    password: string;
}

export interface ISignInResponse {
    token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
    public signinRequester = this.requesterFactory.createRequester<ISignInRequest, ISignInResponse>({
        url: `${Config.apiUrl}/login`,
        method: HttpMethod.POST
    });
    constructor(private requesterFactory: RequesterFactory, private cookieService: CookieService) {
    }

    public signin(signinPayload: ISignInRequest): Observable<ISignInResponse> {
        return this.signinRequester.runRequest(signinPayload);
    }
}
