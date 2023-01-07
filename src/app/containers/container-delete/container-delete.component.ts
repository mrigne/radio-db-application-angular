import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { isNil } from 'lodash';
import { filter, take, tap } from 'rxjs';
import { SnackbarService } from '../../../helpers/services/snackbar.service';
import { containerByIdSelector, containersActions, IContainer } from '../../reducers/containers';

@Component({
    selector: 'rdb-container-delete',
    templateUrl: './container-delete.component.html',
    styleUrls: ['./container-delete.component.scss']
})
export class ContainerDeleteComponent {
    constructor(@Inject(DIALOG_DATA) public containerData: IContainer, private store: Store, private dialogRef: DialogRef, private snackbarService: SnackbarService) {
    }

    public onDelete(): void {
        this.store.select(containerByIdSelector(this.containerData.id)).pipe(
            filter(container => isNil(container)),
            take(1),
            tap(() => {
                this.snackbarService.showSuccessSnackbar(`'${this.containerData.name}' container successfully deleted.`);
                this.dialogRef.close();
            })
        ).subscribe();
        this.store.dispatch(containersActions.deleteContainerById({ containerId: this.containerData.id }));
    }

    public onCancel(): void {
        this.dialogRef.close();
    }
}
