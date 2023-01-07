import { HttpClient, HttpHeaders } from '@angular/common/http';
import { cloneDeep, isObject } from 'lodash';
import { Observable } from 'rxjs';

export enum HttpMethod {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    PATCH = 'PATCH',
    DELETE = 'DELETE'
}
export interface IRequesterConfig {
    url: string;
    method: HttpMethod
}

export class Requester<T, U> {
    private url: string;
    private method: HttpMethod;
    private httpClient: HttpClient;

    constructor(requesterConfig: IRequesterConfig, httpClient: HttpClient) {
        this.url = requesterConfig?.url;
        this.method = requesterConfig?.method;
        this.httpClient = httpClient;
    }

    public runRequest(data?: T): Observable<U> {
        const [preparedUrl, notUsedParams] = this.prepareUrl(data);

        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this.httpClient.request<U>(this.method, preparedUrl, {
            body: notUsedParams,
            headers
        });
    }

    private prepareUrl<T>(data: T): [string, Partial<T>] {
        let preparedUrl = this.url;
        let notUsedParams = cloneDeep(data);
        if (isObject(data)) {
            preparedUrl = Object.keys(data).reduce((resultUrl, currentKey) => {
                if (resultUrl.includes(`{${currentKey}}`)) {
                    delete notUsedParams[currentKey];
                    return resultUrl.replaceAll(`{${currentKey}}`, data?.[currentKey]);
                }
                return resultUrl;
            }, this.url);
        }
        return [preparedUrl, notUsedParams];
    }
}
