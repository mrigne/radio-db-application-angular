import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { distinctUntilChanged, filter, shareReplay, switchMap, take, tap } from 'rxjs';
import { SnackbarService } from '../../../helpers/services/snackbar.service';
import { ValidationErrorMessageHelper } from '../../../helpers/validation-error-message.helper';
import { containerByIdSelector, containersActions } from '../../reducers/containers';
import { itemsActions, itemsSelectorById } from '../../reducers/items';
import { AppRoutes } from '../../routes/app.routes';
import { RouteParams } from '../../routes/route.params';
import { routerSelectors } from '../../routes/router.selectors';

export interface IAddItemForm {
    addAmount: FormControl<number>;
}

@Component({
    selector: 'rdb-item-add',
    templateUrl: './item-add.component.html',
    styleUrls: ['./item-add.component.scss']
})
export class ItemAddComponent implements OnInit {
    @ViewChild('amountInput', { static: false })
    public amountInput: ElementRef;

    public form = this.fb.group<IAddItemForm>({
        addAmount: new FormControl<number>(1, [Validators.required, Validators.min(1)])
    });

    public item$ = this.store.select(routerSelectors.selectRouteParam(RouteParams.itemId)).pipe(
        distinctUntilChanged(),
        switchMap(itemId => {
            return this.store.select(itemsSelectorById(itemId));
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

    public onAdd(): void {
        this.item$.pipe(
            take(1),
            tap(item => {
                const newAmount = item.count + this.form.value.addAmount;

                this.store.select(itemsSelectorById(item?.id)).pipe(
                    filter(item => item.count === newAmount),
                    take(1),
                    tap(() => {
                        this.snackbarService.showSuccessSnackbar('items.addItem.snackBarMessages.successfullyAdded', {
                            itemName: item?.name,
                            addAmount: this.form.value.addAmount
                        });
                        this.router.navigateByUrl(AppRoutes.items.full());
                    })
                ).subscribe();

                this.store.dispatch(itemsActions.updateItemById({
                    newItem: {
                        ...item,
                        count: newAmount
                    }
                }));
            })
        ).subscribe();
    }

    public onFocus(): void {
        this.amountInput.nativeElement.select();
    }
}
