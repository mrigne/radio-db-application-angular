import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IContainer } from '../../reducers/containers';
import { HttpMethod } from '../requests/requester';
import { RequesterFactory } from '../requests/requester-factory';

@Injectable({ providedIn: 'root' })
export class ContainersService {
    private containersRequester = this.requesterFactory.createRequester<void, IContainer[]>({ url: 'https://localhost:7121/containers', method: HttpMethod.GET });
    private createContainerRequester = this.requesterFactory.createRequester<IContainer, void>({ url: 'https://localhost:7121/container', method: HttpMethod.POST });
    private updateContainerRequester = this.requesterFactory.createRequester<IContainer, void>({ url: 'https://localhost:7121/container', method: HttpMethod.PATCH });
    private deleteContainerRequester = this.requesterFactory.createRequester<{ containerId: string }, void>({ url: 'https://localhost:7121/container/{containerId}', method: HttpMethod.DELETE });

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

    public deleteContainer(containerId: string): Observable<void> {
        return this.deleteContainerRequester.runRequest({ containerId });
    }
}
