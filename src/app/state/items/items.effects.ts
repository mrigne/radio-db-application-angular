import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap } from 'rxjs';
import { handleErrors } from '../../../helpers/operators/handle-auth-error.operator';
import { SnackbarService } from '../../../helpers/services/snackbar.service';
import { itemsActions } from '../../reducers/items';
import { ItemsService } from './items.service';

@Injectable()
export class ItemsEffects {
    public loadItems$ = createEffect(() => this.actions$.pipe(
            ofType(itemsActions.loadItemsFromApi),
            switchMap(() => this.itemsService.loadItems().pipe(
                map(items => itemsActions.receivedItems({ items })),
                handleErrors(this.router, this.snackbarService)
            ))
        )
    );

    public updateItem$ = createEffect(() => this.actions$.pipe(
        ofType(itemsActions.updateItemById),
        switchMap(updateItemByIdAction => {
            return this.itemsService.updateItem(updateItemByIdAction.newItem).pipe(
                map(() => itemsActions.loadItemsFromApi()),
                handleErrors(this.router, this.snackbarService)
            );
        })
    ));

    public deleteItem$ = createEffect(() => this.actions$.pipe(
        ofType(itemsActions.deleteItemById),
        switchMap(deleteItemByIdAction => {
            return this.itemsService.deleteItem(deleteItemByIdAction.itemId).pipe(
                map(() => itemsActions.loadItemsFromApi()),
                handleErrors(this.router, this.snackbarService)
            );
        })
    ));

    public addNewItem$ = createEffect(() => this.actions$.pipe(
        ofType(itemsActions.createNewItem),
        switchMap(createNewItemAction => {
            return this.itemsService.createNewItem(createNewItemAction.newItem).pipe(
                map(() => itemsActions.loadItemsFromApi()),
                handleErrors(this.router, this.snackbarService)
            );
        })
    ));

    constructor(private actions$: Actions, private itemsService: ItemsService, private router: Router, private snackbarService: SnackbarService) {
    }
}
