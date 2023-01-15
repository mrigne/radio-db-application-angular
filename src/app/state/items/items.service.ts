import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Config } from '../../config/config';
import { IItem } from '../../reducers/items';
import { HttpMethod } from '../requests/requester';
import { RequesterFactory } from '../requests/requester-factory';

@Injectable({ providedIn: 'root' })
export class ItemsService {
    private itemsRequester = this.requesterFactory.createRequester<void, IItem[]>({ url: `${Config.apiUrl}/items`, method: HttpMethod.GET });
    private createNewItemRequester = this.requesterFactory.createRequester<IItem, void>({ url: `${Config.apiUrl}/items`, method: HttpMethod.POST });
    private updateItemRequester = this.requesterFactory.createRequester<IItem, void>({ url: `${Config.apiUrl}/items/{id}`, method: HttpMethod.PATCH });
    private deleteItemRequester = this.requesterFactory.createRequester<{ id: string }, void>({ url: `${Config.apiUrl}/item/{id}`, method: HttpMethod.DELETE });

    constructor(private requesterFactory: RequesterFactory) {
    }

    public loadItems(): Observable<IItem[]> {
        return this.itemsRequester.runRequest();
    }

    public createNewItem(newItem: IItem) {
        return this.createNewItemRequester.runRequest(newItem);
    }

    public updateItem(updatedItem: IItem) {
        return this.updateItemRequester.runRequest(updatedItem);
    }

    public deleteItem(id: string) {
        return this.deleteItemRequester.runRequest({ id });
    }
}
