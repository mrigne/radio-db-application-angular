import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IItem } from '../../reducers/items';
import { HttpMethod, Requester } from '../requests/requester';
import { RequesterFactory } from '../requests/requester-factory';

@Injectable({ providedIn: 'root' })
export class ItemsService {
    private itemsRequester = this.requesterFactory.createRequester<void, IItem[]>({ url: 'https://localhost:7121/items', method: HttpMethod.GET });
    private createNewItemRequester = this.requesterFactory.createRequester<IItem, void>({ url: 'https://localhost:7121/item', method: HttpMethod.POST });
    private updateItemRequester = this.requesterFactory.createRequester<IItem, void>({ url: 'https://localhost:7121/item', method: HttpMethod.PATCH });
    private deleteItemRequester = this.requesterFactory.createRequester<{ itemId: string }, void>({ url: 'https://localhost:7121/item/{itemId}', method: HttpMethod.DELETE });

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

    public deleteItem(itemId: string) {
        return this.deleteItemRequester.runRequest({ itemId });
    }
}
