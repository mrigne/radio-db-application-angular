import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IRequesterConfig, Requester } from './requester';

@Injectable({ providedIn: 'root' })
export class RequesterFactory {
    constructor(private httpClient: HttpClient) {
    }

    public createRequester<T, U>(requesterConfig: IRequesterConfig): Requester<T, U> {
        return new Requester<T, U>(requesterConfig, this.httpClient);
    }
}
