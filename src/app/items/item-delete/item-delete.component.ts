import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { isNil } from 'lodash';
import { filter, take, tap } from 'rxjs';
import { SnackbarService } from '../../../helpers/services/snackbar.service';
import { containerByIdSelector, containersActions } from '../../reducers/containers';
import { IItem, itemsActions, itemsSelectorById } from '../../reducers/items';

@Component({
    selector: 'rdb-item-delete',
    templateUrl: './item-delete.component.html',
    styleUrls: ['./item-delete.component.scss']
})
export class ItemDeleteComponent implements OnInit {
    public container$ = this.store.select(containerByIdSelector(this.itemData.containerId));

    constructor(@Inject(DIALOG_DATA) public itemData: IItem, private store: Store, private dialogRef: DialogRef, private snackbarService: SnackbarService) {
    }

    public ngOnInit(): void {
        this.store.dispatch(containersActions.loadContainersFromApi());
    }

    public onDelete(): void {
        this.store.select(itemsSelectorById(this.itemData.id)).pipe(
            filter(item => isNil(item)),
            take(1),
            tap(() => {
                this.snackbarService.showSuccessSnackbar(`${this.itemData.name} successfully deleted.`);
                this.dialogRef.close();
            })
        ).subscribe();
        this.store.dispatch(itemsActions.deleteItemById({
            itemId: this.itemData.id
        }));
    }

    public onCancel(): void {
        this.dialogRef.close();
    }
}
