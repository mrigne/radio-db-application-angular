import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { distinctUntilChanged, filter, map, shareReplay, switchMap, take, tap } from 'rxjs';
import { SnackbarService } from '../../../helpers/services/snackbar.service';
import { getErrorMessageByError } from '../../../helpers/validation-error-message.helper';
import { containerByIdSelector, containersActions, containersSelector } from '../../reducers/containers';
import { IItem, itemsActions, itemsSelector, itemsSelectorById } from '../../reducers/items';
import { AppRoutes } from '../../routes/app.routes';
import { RouteParams } from '../../routes/route.params';
import { routerSelectors } from '../../routes/router.selectors';

@Component({
    selector: 'rdb-item-eject',
    templateUrl: './item-eject.component.html',
    styleUrls: ['./item-eject.component.scss']
})
export class ItemEjectComponent implements OnInit {
    public readonly getErrorMessageByError = getErrorMessageByError;

    @ViewChild('countInput', { static: false })
    public countInput: ElementRef;

    public form = this.fb.group({
        ejectCount: new FormControl<number>(1, [Validators.required, Validators.min(1)])
    });

    public item$ = this.store.select(routerSelectors.selectRouteParam(RouteParams.itemId)).pipe(
        distinctUntilChanged(),
        switchMap(itemId => {
            return this.store.select(itemsSelectorById(itemId));
        }),
        filter(Boolean),
        tap(item => {
            this.form.controls.ejectCount.setValidators([Validators.required, Validators.min(1), Validators.max(item.count)]);
            this.form.controls.ejectCount.updateValueAndValidity();
        }),
        shareReplay({
            bufferSize: 1,
            refCount: true
        })
    );

    public container$ = this.item$.pipe(
        switchMap(item => {
            return this.store.select(containerByIdSelector(item?.containerId));
        })
    );

    constructor(private store: Store, private fb: FormBuilder, private router: Router, private snackbarService: SnackbarService) {
    }

    public ngOnInit(): void {
        this.store.dispatch(containersActions.loadContainersFromApi());
    }

    public onEject(): void {
        this.item$.pipe(
            take(1),
            tap(item => {
                if (this.form.value.ejectCount === item.count) {
                    this.store.dispatch(itemsActions.deleteItemById({ itemId: item.id }));
                    this.store.select(itemsSelector).pipe(
                        filter(items => Array.isArray(items) && !items.some(itemFromStore => itemFromStore.id === item.id)),
                        take(1),
                        tap(() => {
                            this.snackbarService.showSuccessSnackbar(`${item.name} successfully ejected. As all items were ejected - it was deleted from container.`);
                            this.router.navigateByUrl(AppRoutes.items.full());
                        })
                    ).subscribe();
                } else {
                    const newCount = item.count - this.form.value.ejectCount;
                    this.store.select(itemsSelectorById(item.id)).pipe(
                        filter(item => item.count === newCount),
                        take(1),
                        tap(() => {
                            this.snackbarService.showSuccessSnackbar(`${item.name} successfully ejected. Ejected count: ${this.form.value.ejectCount}`);
                            this.router.navigateByUrl(AppRoutes.items.full());
                        })
                    ).subscribe();
                    this.store.dispatch(itemsActions.updateItemById({
                        newItem: {
                            ...item,
                            count: newCount
                        }
                    }));
                }
            })
        ).subscribe();
    }

    public onFocus(): void {
        this.countInput.nativeElement.select();
    }
}
