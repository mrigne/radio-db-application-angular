import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Config } from '../../config/config';
import { IContainer } from '../../reducers/containers';
import { HttpMethod } from '../requests/requester';
import { RequesterFactory } from '../requests/requester-factory';

@Injectable({ providedIn: 'root' })
export class ContainersService {
    private containersRequester = this.requesterFactory.createRequester<void, IContainer[]>({ url: `${Config.apiUrl}/containers`, method: HttpMethod.GET });
    private createContainerRequester = this.requesterFactory.createRequester<IContainer, void>({ url: `${Config.apiUrl}/containers`, method: HttpMethod.POST });
    private updateContainerRequester = this.requesterFactory.createRequester<IContainer, void>({ url: `${Config.apiUrl}/containers/{id}`, method: HttpMethod.PATCH });
    private deleteContainerRequester = this.requesterFactory.createRequester<{ id: string }, void>({ url: `${Config.apiUrl}/containers/{id}`, method: HttpMethod.DELETE });

    constructor(private requesterFactory: RequesterFactory) {
    }

    public loadContainers(): Observable<IContainer[]> {
        return this.containersRequester.runRequest();
    }

    public createContainer(newContainer: IContainer): Observable<void> {
        return this.createContainerRequester.runRequest(newContainer);
    }

    public updateContainer(newContainer: IContainer): Observable<void> {
        return this.updateContainerRequester.runRequest(newContainer);
    }

    public deleteContainer(id: string): Observable<void> {
        return this.deleteContainerRequester.runRequest({ id });
    }
}
