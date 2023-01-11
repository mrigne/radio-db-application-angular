import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { distinctUntilChanged, filter, shareReplay, switchMap, take, tap } from 'rxjs';
import { SnackbarService } from '../../../helpers/services/snackbar.service';
import { ValidationErrorMessageHelper } from '../../../helpers/validation-error-message.helper';
import { containerByIdSelector, containersActions } from '../../reducers/containers';
import { itemsActions, itemsSelector, itemsSelectorById } from '../../reducers/items';
import { AppRoutes } from '../../routes/app.routes';
import { RouteParams } from '../../routes/route.params';
import { routerSelectors } from '../../routes/router.selectors';

export interface IEjectItemForm {
    ejectAmount: FormControl<number>;
}

@Component({
    selector: 'rdb-item-eject',
    templateUrl: './item-eject.component.html',
    styleUrls: ['./item-eject.component.scss']
})
export class ItemEjectComponent implements OnInit {
    @ViewChild('amountInput', { static: false })
    public amountInput: ElementRef;

    public form = this.fb.group<IEjectItemForm>({
        ejectAmount: new FormControl<number>(1, [Validators.required, Validators.min(1)])
    });

    public item$ = this.store.select(routerSelectors.selectRouteParam(RouteParams.itemId)).pipe(
        distinctUntilChanged(),
        switchMap(itemId => {
            return this.store.select(itemsSelectorById(itemId));
        }),
        filter(Boolean),
        tap(item => {
            this.form.controls.ejectAmount.setValidators([Validators.required, Validators.min(1), Validators.max(item.count)]);
            this.form.controls.ejectAmount.updateValueAndValidity();
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

    constructor(public validationErrorMessageHelper: ValidationErrorMessageHelper,
                private store: Store,
                private fb: FormBuilder,
                private router: Router,
                private snackbarService: SnackbarService) {
    }

    public ngOnInit(): void {
        this.store.dispatch(containersActions.loadContainersFromApi());
    }

    public onEject(): void {
        this.item$.pipe(
            take(1),
            tap(item => {
                if (this.form.value.ejectAmount === item.count) {
                    this.store.dispatch(itemsActions.deleteItemById({ itemId: item.id }));
                    this.store.select(itemsSelector).pipe(
                        filter(items => Array.isArray(items) && !items.some(itemFromStore => itemFromStore.id === item.id)),
                        take(1),
                        tap(() => {
                            this.snackbarService.showSuccessSnackbar(
                                'items.ejectItem.snackBarMessages.successfullyEjectedAndDeleted',
                                {
                                    itemName: item?.name
                                }
                            );
                            this.router.navigateByUrl(AppRoutes.items.full());
                        })
                    ).subscribe();
                } else {
                    const newAmount = item.count - this.form.value.ejectAmount;
                    this.store.select(itemsSelectorById(item.id)).pipe(
                        filter(item => item.count === newAmount),
                        take(1),
                        tap(() => {
                            this.snackbarService.showSuccessSnackbar(
                                'items.ejectItem.snackBarMessages.successfullyEjected',
                                {
                                    itemName: item?.name,
                                    ejectAmount: this.form.value.ejectAmount
                                }
                            );
                            this.router.navigateByUrl(AppRoutes.items.full());
                        })
                    ).subscribe();
                    this.store.dispatch(itemsActions.updateItemById({
                        newItem: {
                            ...item,
                            count: newAmount
                        }
                    }));
                }
            })
        ).subscribe();
    }

    public onFocus(): void {
        this.amountInput.nativeElement.select();
    }
}
